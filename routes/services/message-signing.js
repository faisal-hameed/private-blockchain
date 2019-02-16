
// Setup libraries
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')


var keyPair = bitcoin.ECPair.fromWIF('L4ZYGVyypC1riua7f8SBgVrN6bswk7ufNubaSh7NMLJTpWqcSJv3')
var privateKey = keyPair.privateKey
var message = '1CYgQ8wbdWZPGEWgbxZLq5JUe5e1ECWPe7:1538207367849:starRegistry'

var signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
signature = signature.toString('base64');
console.log("Sig-1 : "+signature)

var address = '1CYgQ8wbdWZPGEWgbxZLq5JUe5e1ECWPe7'

console.log(bitcoinMessage.verify(message, address, signature))
