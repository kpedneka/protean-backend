var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');

// require other modules
var User = require('../models/users');
var dbFunctions = require('../db_functions/users');

// jwt stuff for authentication
var startegy = require('../jwt/config').startegy;
var jwtOptions = require('../jwt/config').jwtOptions;
var authenticate = passport.authenticate('jwt', {session: false});

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
  
  dbFunctions.findOne(req.user.username, function(err, user) {
  	res.send({name: user.name, username: user.username, bills: user.bills});
  });

});


/* POST login for user */
router.post('/login', function(req, res, next) {
	console.log('attempt to login')
	if (!req.body.username || !req.body.password){
		return res.sendStatus(404);
	}

	dbFunctions.findOne(req.body.username, function(err, user) {
		console.log('this is the current user ', user)
		if (user){
			var compare = bcrypt.compareSync(req.body.password, user.password);
			console.log('compare result ', compare);
			var payload = {id: user.username};
			var token = jwt.sign(payload, jwtOptions.secretOrKey);
			res.status(200).json({message: "ok", token: token});
		} else {
			// no user found, but also unauthorized
			res.status(401).json({message: "passwords did not match or no such user"});
		}
	});
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
