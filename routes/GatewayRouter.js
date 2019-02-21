const express = require('express');
const router = express.Router();

const Hashing = require('./services/Hashing');
const MessageSigning = require('./services/MessageSigning');

/* Generate hash of given data {"data" : ""}*/
router.post('/hash', function(req, res, next){
  const reqBody = req.body;
  console.log('Req body : ' + JSON.stringify(reqBody));
  if (!reqBody){
    console.log("Missing key : data");
  }
  console.log('Generate hash of : ' + reqBody.data);
  Hashing.generateSHA256Hash(reqBody.data)
  .then(function(data){
    res.send(JSON.stringify(data));
  })
  .catch(function(err){
    console.log('Error generateHash(data)' + err);
    res.status(500).send({
      'code':'500',
      'status':'Internal Server Error',
      'message':`${err}`}
    );
  });
});


/* Sign message with private key {"message":"", "privateKey":""} */
router.post('/sign/generate', function(req, res, next){
  const reqBody = req.body;
  console.log('Req body : ' + JSON.stringify(reqBody));
  const message = req.body.message;
  const privateKey = req.body.privateKey
  console.log("chk -0" + privateKey);

  MessageSigning.signMessage(message, privateKey)
  .then(function(data){
    res.send(JSON.stringify({"signature" : data}));
  })
  .catch(function(err){
    console.log('Error signMessage(message, privateKey)' + err);
    res.status(500).send({
      'code':'500',
      'status':'Internal Server Error',
      'message':`${err}`}
    );
  });
});

/* Validate message signature {"message":"", "privateKey":""} */
router.post('/sign/validate', function(req, res, next){
  const reqBody = req.body;
  console.log('Req body : ' + JSON.stringify(reqBody));
  const message = req.body.message;
  const walletAddress = req.body.walletAddress;
  const signature = req.body.signature

  MessageSigning.validateSignature(message, walletAddress, signature)
  .then(function(data){
    res.send(JSON.stringify({"signature" : data}));
  })
  .catch(function(err){
    console.log('Error validateSignature(message, walletAddress, signature)' + err);
    res.status(500).send({
      'code':'500',
      'status':'Internal Server Error',
      'message':`${err}`}
    );
  });
});

module.exports = router;
