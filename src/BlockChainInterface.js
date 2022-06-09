import Web3 from 'web3/dist/web3.min.js';
import ABI_ERC20 from './contract_data/abis/ABI_ERC20.json';
import ABI_ERC1155 from './contract_data/abis/ABI_ERC1155.json';
import ABI_ESCROW from './contract_data/abis/ABI_ESCROW.json';
import ABI_NFT from './contract_data/abis/ABI_NFT.json';


export default class BlockChainInterface {

  async load() {
      if(window.ethereum) {
        await window.ethereum.request({method: 'eth_requestAccounts'});
        this.web3Obj = new Web3(window.ethereum);
        
        console.log();
      }
      else {
        alert('no meta mask');
      }
      console.log('loaded');
  }   

  async getChain() {
    return this.web3Obj.eth.getChainId();
  }

  async approveERC20(addressToken, addressContract, amt) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ERC20, addressToken);
    
    let result = await contract.methods.approve(addressContract, amt).send({from: addressAccount});
    console.log(await result);
    return true;
  }

  async approveERC1155(addressToken, addressContract, allow) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ERC1155, addressToken);
    
    let result = await contract.methods.setApprovalForAll(addressContract, allow).send({from: addressAccount});
    console.log(await result);
    return true;
  }

  async mint(addressContract) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_NFT, addressContract);

    let result = await contract.methods.mint().send({from: addressAccount});
    console.log(await result);
  }

  async createEscrow(addressContract, nftContract, nftID, nftAmount, tokenRecieve, weiRecieve) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ESCROW, addressContract);

    let result = await contract.methods.createEscrow(nftContract, nftID, nftAmount, tokenRecieve, weiRecieve).send({from: addressAccount});
    console.log(await result);
  }

  async removeEscrow(addressContract, uuid) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ESCROW, addressContract);

    let result = await contract.methods.removeEscrow(uuid).send({from: addressAccount});
    console.log(await result);
  }

  async executeEscrow(addressContract, uuid) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ESCROW, addressContract);

    let result = await contract.methods.executeEscrow(uuid).send({from: addressAccount});
    console.log(await result);
  }

  async getEscrow(addressContract, uuid) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ESCROW, addressContract);

    let result = await contract.methods.getEscrow(uuid).call({from: addressAccount});
    console.log(await result);
    let resultParsed = String(result).split(",");
    let resultStruct = {
      'msg.sender': addressAccount,
      'nftOwner': resultParsed[0],
      'nftContract': resultParsed[1],
      'nftID': resultParsed[2],
      'nftAmount': resultParsed[3],
      'tokenRecieve': resultParsed[4],
      'weiAmount': resultParsed[5],
      'uuid' : resultParsed[6]
    }
    let resultViewable = "nftOwner: " + resultParsed[0]
      + "\nnftContract: " + resultParsed[1]
      + "\nnftID: " + resultParsed[2]
      + "\nnftAmount: " + resultParsed[3]
      + "\ntoken in exchange: " + resultParsed[4]
      + "\ntokens: " + resultParsed[5] / 10**18;
      + "\nuuid: " + resultParsed[6];
    alert(resultViewable);
    return resultStruct;
  }

  async getMyEscrowUUIDs(addressContract) {
    const addressAccount = (await this.web3Obj.eth.getAccounts())[0];
    const contract = new this.web3Obj.eth.Contract(ABI_ESCROW, addressContract);

    let result = await contract.methods.getMyEscrowUUIDs().call({from: addressAccount});
    console.log(await result);
    return result;
  }

}