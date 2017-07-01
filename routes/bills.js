var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

// importing user model
var Bill = require('../models/bills');
var User = require('../models/users');
var dbFunctions = require('../db_functions/bills');

// middleware for data validation
router.use(bodyParser.json());
router.use(expressValidator());


/* GET all bills. */
router.get('/',  function(req, res, next) {
  console.log('I am here \n\n\n')
  dbFunctions.findMyBills('kpedneka', function(err, bills) {
    if (err) return res.sendStatus(500);
    res.send(bills);
  });
  
});

/* POST new bill. */
router.post('/',  function(req, res, next) {
  
  var newBill = {
    payee: req.body.payee,
    payer: req.body.payer,
    title: req.body.title,
    body: req.body.body,
    amount: req.body.amount
  };

  console.log('created new object for ', newBill.payee);
  dbFunctions.create(newBill, function(err, done){
    if (err){
      // if there is an error, check pre-save for Bill
      console.log(err);
      return res.sendStatus(500);
    }
    // always 201
    res.sendStatus(done);
  });

});


module.exports = router;