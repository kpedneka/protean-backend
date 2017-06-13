var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');

// importing user model
var Bill = require('../models/bills');
var User = require('../models/users');
var dbFunctions = require('../db_functions/bills');

// middleware for data validation
router.use(bodyParser.json());
router.use(expressValidator());

// jwt stuff
var startegy = require('../jwt/config').startegy;
var jwtOptions = require('../jwt/config').jwtOptions;

var authenticate = passport.authenticate('jwt', {session: false});

/* GET all bills. */
router.get('/', authenticate, function(req, res, next) {
  
  dbFunctions.findFrom(req.user._id, function(err, bills) {
    if (err) return res.sendStatus(500);
    res.status(200).json(bills);
  });
  
});

/* POST new bill. */
router.post('/', authenticate, function(req, res, next) {
  
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