const express = require('express');
const router = express.Router();

const Hashing = require('./services/Hashing');
const MessageSigning = require('./services/MessageSigning');

/* Generate hash of given data {"data" : ""}*/
router.post('/hash', function(req, res, next){
  console.log('Req body : ' + JSON.stringify(req.body));

  console.log('Generate hash of : ' + req.body.data);
  Hashing.generateSHA256Hash(req.body.data)
  .then(function(result){
    res.send({"hash": result});
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


/* Sign data with private key {"data":"", "privateKey":""} */
router.post('/sign/generate', function(req, res, next){
  console.log('Req body : ' + JSON.stringify(req.body));

  MessageSigning.signMessage(req.body.data, req.body.privateKey)
  .then(function(result){
    res.send({"signature" : result});
  })
  .catch(function(err){
    console.log('Error signMessage(data, privateKey)' + err);
    res.status(500).send({
      'code':'500',
      'status':'Internal Server Error',
      'message':`${err}`}
    );
  });
});

/* Validate data signature {"data":"", "privateKey":""} */
router.post('/sign/validate', function(req, res, next){
  console.log('Req body : ' + JSON.stringify(req.body));

  MessageSigning.validateSignature(req.body.data, req.body.walletAddress, req.body.signature)
  .then(function(result){
    res.send(JSON.stringify({"isValid" : result}));
  })
  .catch(function(err){
    console.log('Error validateSignature(data, walletAddress, signature)' + err);
    res.status(500).send({
      'code':'500',
      'status':'Internal Server Error',
      'message':`${err}`}
    );
  });
});

module.exports = router;
