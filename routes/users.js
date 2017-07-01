var express = require('express');
var session = require('express-session');
var router = express.Router();
var passport = require('passport');
// var facebookStrategy = require('passport-facebook').Strategy;

// keep APP ID and APP SECRET safe, do not share this information.
var User = require('../models/users');
// contains app id, app secret, callbackurl
var facebookAuth = require('../config/auth').facebookAuth;
// conains all the logic for facebook login
var facebookLogin = require('../config/passport');
facebookLogin(passport);


// middleware function to check if a user is authenticated
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		console.log('user is authenticated');
		next();
	} else {
		console.log('user is not authenticated');
		res.redirect('/api/users/login');
	}
}

//applying middleware for passport and storing the access tokens
router.use(session({ secret: require('../config/session').sessionSecret }));
router.use(passport.initialize());
router.use(passport.session());

/* when a user clicks log in with facebook, they will be using this route to sign in with facebook */
router.get('/auth', passport.authenticate('facebook', {scope: ['email']}), function(req, res, next) {
	res.sendStatus(200);
});


/* callback URL route that facebook ruturns to after authenticating the user */
router.get('/callback', passport.authenticate('facebook', { successRedirect: '/api/users/profile', failureRedirect: '/api/users/login'}), function(req, res, next) {
	// some stuff that will never hit
	res.sendStatus(200);
});


/* Login page that user lands on when accesstoken is not valid */
router.get('/login', function(req, res, next) {
	res.send('Failed to log in using facebook');
});

/* Logout action that deletes session and redirects to the login route */
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/api/users/login');
});


/* After successful login, display user data for the dashboard */
router.get('/profile', isLoggedIn, function(req, res, next) {
	res.send(req.user);
});

module.exports = router;
