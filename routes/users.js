var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// require other modules
var User = require('../models/users');
var dbFunctions = require('../db_functions/users');
var auth = require("../jwt/auth.js")();  
var config = require("../jwt/config");
router.use(auth.initialize());

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  dbFunctions.findOne(req.user.username, function(err, user) {
  	res.send({name: user.name, username: user.username});
  });

});


/* POST login for user */
router.post('/login', function(req, res, next) {
	console.log('attempt to login')
	console.log(req.body)
	if (!req.body.username || !req.body.password){
		console.log('missing fields');
		return res.sendStatus(404);
	}
	User.findOne({username: req.body.username}, function(err, user) {
		if (!user){
			console.log("!user");
			res.status(404).json({mesage: "no such user"});
		} else {
			bcrypt.compare(req.body.password, user.password, function(err, result) {
			    // result == true
			    console.log(user.username)
			    var token = jwt.sign({id: user.id}, config.secret, { expiresIn: 10080 }); //seconds
	          	res.status(200).json({ success: true, token: 'JWT ' + token });
			});
		}

	})
});

/* Create new user. */
router.post('/', function(req, res, next) {
	var newUser = new User({
		name: req.body.name,
	    username: req.body.username,
	    password: req.body.password,
	});
	console.log('created new object for ', newUser.username);
	dbFunctions.create(newUser, function(err, done){
		if (err){
			console.log(err);
			return res.sendStatus(500);
		}
		// could be 201 or 304
		res.sendStatus(done);
	})
});


module.exports = router;
