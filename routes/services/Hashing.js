const SHA256 = require('crypto-js/sha256');

class Hashing{

    static async generateSHA256Hash(data) {
        return new Promise((resolve, reject) => {
            if(!data){
                reject("data is undefind");
            }
            let hash = SHA256(JSON.stringify(data)).toString();
            console.log('Generated hash : ' + hash);
            resolve(hash);
        });
    }
}

module.exports = Hashing