const {LevelDB} = require('./leveldb.js');

const SHA256 = require('crypto-js/sha256');
const chainDB = './chaindata';

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
  }

  generateHash() {
    return SHA256(JSON.stringify(this)).toString();
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
   constructor(){
		this.db = new LevelDB(chainDB);
		let height = this.getBlockChainHeight().then((height) => {
      console.log('Chain height is : ' + height)
			if (height < 0){
				console.log('Adding genesis block');
				this.addBlock(new Block("First block in the chain - Genesis block"));
			}
		});
  }

  // Add new block
  async addBlock(newBlock){
		console.log("adding new block");
    // Block height
    let height = await this.getBlockChainHeight() + 1;
		console.log('using height : ' + height);
		newBlock.height = height;

    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(height > 0){
      let prevBlock = await this.getBlock(height-1);
			newBlock.previousBlockHash = prevBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.generateHash();
    
    // Adding block object to chain
    let result = await this.db.add(newBlock.height, JSON.stringify(newBlock).toString());

    return newBlock;
  }

  // validate block
  async validateBlock(blockHeight){
    // get block object
    let block = await this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

  // Validate blockchain
  async validateChain(){
    let errorLog = [];
    let height = await this.getBlockChainHeight();
    for (var i = 0; i < height-1; i++) {
      // validate block
      let isBlockValid = await this.validateBlock(i);
      if (!isBlockValid)
        errorLog.push(i);
      // compare blocks hash link
      let block = await this.getBlock(i);
      let previousBlock = await this.getBlock(i+1);
      console.log(block.hash)
      console.log(previousBlock.previousBlockHash)
      if (block.hash!==previousBlock.previousBlockHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
      return false;
    } else {
      console.log('No errors detected');
      return true;
    }
  }

  // Get block height
  async getBlockChainHeight(){
    // return object as a single string
    let height = await this.db.countRows() - 1;
    return height;
  }

  // get block
  async getBlock(blockHeight){
    // return object as a single string
    let block = await this.db.get(blockHeight);
    return JSON.parse(block);
  }
}

module.exports = {
  Blockchain: Blockchain,
  Block: Block
}
