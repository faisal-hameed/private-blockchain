/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

class LevelDB {

    constructor() {
        this.db = level(chainDB);
    }

		addLevelDBData(key, value) {
				return new Promise((resolve, reject) => {
          this.db.put(key, value, function(err) {
  						if (err) {
  								console.log('Block ' + key + ' submission failed', err);
                  reject(err);
  						} else {
                resolve(value);
              }
  			  });
        });
    }

		// Get data from levelDB with key
		getLevelDBdata(key) {
	    return new Promise((resolve, reject) => {
	        this.db.get(key, (err, value) => {
	            if (err) {
	                console.log("DB err: ", err);
	                reject(err);
	            } else {
	                resolve(value);
	            }
	        });
	    });
		}

		getBlockHeight() {
			return new Promise((resolve) => {
        let count = -1;
		    this.db.createReadStream()
		    .on('data', () => count++)
        .on('error', () => reject(NaN))
		    .on('close', () => resolve(count));
		  });
		}
}

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
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
   constructor(){
		this.db = new LevelDB();
		let height = this.getBlockHeight().then((height) => {
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
    let height = await this.getBlockHeight() + 1;
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
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
		let result = await this.db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());

    return newBlock;
  }

    // Get block height
		async getBlockHeight(blockHeight){
      // return object as a single string
		  let height = await this.db.getBlockHeight();
			return height;
    }

    // get block
    async getBlock(blockHeight){
      // return object as a single string
		  let block = await this.db.getLevelDBdata(blockHeight);
			return JSON.parse(block);
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
			let height = await this.getBlockHeight();
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
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
        return false;
      } else {
        console.log('No errors detected');
        return true;
      }
    }
}

module.exports = {
  Blockchain: Blockchain,
  Block: Block
}

//let blockchain = new Blockchain();
//blockchain.validateChain().then((data) => console.log(data));
// blockchain.addBlock(new Block("New block 1"));
