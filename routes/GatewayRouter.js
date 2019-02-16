const express = require('express');
const router = express.Router();

const Hashing = require('./services/Hashing');
const hashing = new Hashing();

/* Generate hash of given data */
router.post('/hash', function(req, res, next){
  let reqBody = req.body.data;
  console.log('Generate hash of : ' + reqBody);
  console.log('Req body : ' + JSON.stringify(reqBody));
  hashing.generateHash(reqBody)
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

module.exports = router;
