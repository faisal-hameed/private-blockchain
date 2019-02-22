
// Setup libraries
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')

/**
 * Class to sign and validate messages/transactions
 */
class MessageSigning {

    static async signMessage(data, privateKey) {
        return new Promise((resolve, reject) => {
            if(!data || !privateKey){
                reject("Missing parameters");
            }
            
            var keyPair = bitcoin.ECPair.fromWIF(privateKey)
            var pKey = keyPair.privateKey

            var signature = bitcoinMessage.sign(data, pKey, keyPair.compressed)
            console.log("Signature generated : " + signature)
            signature = signature.toString('base64');
            console.log("Base64 Signature : " + signature)
            resolve(signature);
        });
    }

    static async validateSignature(data, address, signature) {
        return new Promise((resolve, reject) => {
            if(!data || !address || !signature){
                reject("Missing parameters");
            }

            let result = bitcoinMessage.verify(data, address, signature);
            console.log("Signature is " + result);
            resolve(result);
        });
    }
}

module.exports = MessageSigning