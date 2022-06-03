import BlockChainInterface from './BlockChainInterface';
import Addresses from './contract_data/Addresses';

(async () => {
    let bcInterface = new BlockChainInterface();
    await bcInterface.load();

    document.getElementById('mint-btn').addEventListener('click', async () => {
        await bcInterface.mint(Addresses.NFT);
    });

    document.getElementById('createEscrow-btn').addEventListener('click', async () => {
        try {
            let nftContract = document.getElementById('nftContract-inp').value;
            let nftID = document.getElementById('nftID-inp').value;
            let nftAmount = document.getElementById('nftAmount-inp').value;
            let tokenRecieve = document.getElementById('tokenRecieve-inp').value;
            let weiRecieve = BigInt(document.getElementById('etherRecieve-inp').value * 10**18);
            if (await bcInterface.approveERC1155(nftContract, Addresses.ESCROW, true)) {
                await bcInterface.createEscrow(Addresses.ESCROW, nftContract, nftID, nftAmount, tokenRecieve, weiRecieve);
            }
        } catch {
            alert("creation failed, check inputs");
        }
    });

    document.getElementById('removeEscrow-btn').addEventListener('click', async () => {
        try {
            let index = document.getElementById('index-inp').value;
            let e = await bcInterface.getEscrow(Addresses.ESCROW, index);
            if (e['msg.sender'] == e.nftOwner) {
                await bcInterface.removeEscrow(Addresses.ESCROW, index);
            } else {
                alert("you do not own this escrow");
            }
        } catch {
            alert("removal failed");
        }
    });

    document.getElementById('executeEscrow-btn').addEventListener('click', async () => {
        try {
            let index = document.getElementById('index-inp').value;
            let e = await bcInterface.getEscrow(Addresses.ESCROW, index);
            if (await bcInterface.approveERC20(e.tokenRecieve, Addresses.ESCROW, e.weiAmount)) {
                await bcInterface.executeEscrow(Addresses.ESCROW, index);
            }
        } catch {
            alert("execution failed");
        }
    });

    document.getElementById('getEscrow-btn').addEventListener('click', async () => {
        try {
            let index = document.getElementById('index-inp').value;
            await bcInterface.getEscrow(Addresses.ESCROW, index);
        } catch {
            alert("escrow does not exist at this index");
        }
        
    });

    document.getElementById('getMyEscrowIndexes-btn').addEventListener('click', async () => {
        let myEscrowIndexes = await bcInterface.getMyEscrowIndexes(Addresses.ESCROW);
        if (myEscrowIndexes.length > 0) {
            alert(myEscrowIndexes);
        } else {
            alert("you have 0 escrows");
        }
        
    });

    document.getElementById('getMyEscrows-btn').addEventListener('click', async () => {
        let myEscrowIndexes = await bcInterface.getMyEscrowIndexes(Addresses.ESCROW);
        if (myEscrowIndexes.length > 0) {
            for (let i=0; i < myEscrowIndexes.length; i++) {
                bcInterface.getEscrow(Addresses.ESCROW, i);
            }
        } else {
            alert("you have 0 escrows");
        }        
    });

})();

