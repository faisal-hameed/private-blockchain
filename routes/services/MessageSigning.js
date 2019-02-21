
// Setup libraries
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')

/**
 * Class to sign and validate messages/transactions
 */
class MessageSigning {

    static async signMessage(message, privateKey) {
        return new Promise((resolve, reject) => {
            var keyPair = bitcoin.ECPair.fromWIF(privateKey)
            var pKey = keyPair.privateKey

            var signature = bitcoinMessage.sign(message, pKey, keyPair.compressed)
            console.log("Signature generated : " + signature)
            signature = signature.toString('base64');
            console.log("Base64 Signature : " + signature)
            resolve(signature);
        });
    }

    static async validateSignature(message, address, signature) {
        return new Promise((resolve, reject) => {
            let result = bitcoinMessage.verify(message, address, signature);
            console.log("Signature is " + result);
            resolve(result);
        });
    }
}

module.exports = MessageSigning