import BlockChainInterface from './BlockChainInterface';
import Addresses from './contract_data/Addresses';

(async () => {
    let bcInterface = new BlockChainInterface();
    let addressNFT;
    let addressEscrow;
    await bcInterface.load();
    setChainSpecificContracts(await bcInterface.getChain());

    await ethereum.on('chainChanged', async(chainId) => {
        // window.location.reload();
        let cID = await bcInterface.getChain();
        console.log("chain: " + cID);
        setChainSpecificContracts(cID);
    });

    function setChainSpecificContracts(chainId) {
        switch(chainId) {
            case 42:
                addressNFT = Addresses.NFT_KOVAN;
                addressEscrow = Addresses.ESCROW_KOVAN;
                break;
            case 4:
                addressNFT = Addresses.NFT_RINKEBY;
                addressEscrow = Addresses.ESCROW_RINKEBY;
                break;
            case 5:
                addressNFT = Addresses.NFT_GOERLI;
                addressEscrow = Addresses.ESCROW_GOERLI;
                break;
            case 56:
                addressNFT = Addresses.NFT_BSC;
                addressEscrow = Addresses.ESCROW_BSC;
                break;
      }
    }

    document.getElementById('mint-btn').addEventListener('click', async () => {
        let cID = await bcInterface.getChain();
        if (cID != 42 && cID != 4 && cID != 5) {
            alert("i do not have gas to cover deployment on mainnets. kovan, rinkeby, and goerli testnests available");
        } else {
            await bcInterface.mint(addressNFT);
            alert("contract address: " + addressNFT);
            alert("nft ID: 1");
        }
    });

    document.getElementById('createEscrow-btn').addEventListener('click', async () => {
        try {
            let nftContract = document.getElementById('nftContract-inp').value;
            let nftID = document.getElementById('nftID-inp').value;
            let nftAmount = document.getElementById('nftAmount-inp').value;
            let tokenRecieve = document.getElementById('tokenRecieve-inp').value;
            let weiRecieve = BigInt(document.getElementById('etherRecieve-inp').value * 10**18);
            if (await bcInterface.approveERC1155(nftContract, addressEscrow, true)) {
                await bcInterface.createEscrow(addressEscrow, nftContract, nftID, nftAmount, tokenRecieve, weiRecieve);
            }
        } catch {
            alert("creation failed, check inputs");
        }
    });

    document.getElementById('removeEscrow-btn').addEventListener('click', async () => {
        try {
            let uuid = document.getElementById('uuid-inp').value;
            let e = await bcInterface.getEscrow(addressEscrow, uuid);
            if (e['msg.sender'] == e.nftOwner) {
                await bcInterface.removeEscrow(addressEscrow, uuid);
            } else {
                alert("you do not own this escrow");
            }
        } catch {
            alert("removal failed");
        }
    });

    document.getElementById('executeEscrow-btn').addEventListener('click', async () => {
        try {
            let uuid = document.getElementById('uuid-inp').value;
            let e = await bcInterface.getEscrow(addressEscrow, uuid);
            if (await bcInterface.approveERC20(e.tokenRecieve, addressEscrow, e.weiAmount)) {
                await bcInterface.executeEscrow(addressEscrow, uuid);
            }
        } catch {
            alert("failed");
        }
    });

    document.getElementById('getEscrow-btn').addEventListener('click', async () => {
        try {
            let uuid = document.getElementById('uuid-inp').value;
            await bcInterface.getEscrow(addressEscrow, uuid);
        } catch {
            alert("sell order does not exist with this uuid");
        }
        
    });

    document.getElementById('getMyEscrowUUIDs-btn').addEventListener('click', async () => {
        let myEscrowUUIDs = await bcInterface.getMyEscrowUUIDs(addressEscrow);
        if (myEscrowUUIDs.length > 0) {
            for (let i=0; i < myEscrowUUIDs.length; i++) {
                alert(myEscrowUUIDs[i]);
            }
        } else {
            alert("you have 0 sell orders");
        }
        
    });

    document.getElementById('getMyEscrows-btn').addEventListener('click', async () => {
        let myEscrowUUIDs = await bcInterface.getMyEscrowUUIDs(addressEscrow);
        if (myEscrowUUIDs.length > 0) {
            for (let i=0; i < myEscrowUUIDs.length; i++) {
                bcInterface.getEscrow(addressEscrow, myEscrowUUIDs[i]);
            }
        } else {
            alert("you have 0 sell orders");
        }        
    });

})();

