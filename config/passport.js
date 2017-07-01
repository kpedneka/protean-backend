var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/users');
var facebookAuth = require('./auth');


module.exports = function (passport) {
	// sensitive information about facebook app.
	var fbOpts = {
		clientID: facebookAuth.clientID,
		clientSecret: facebookAuth.clientSecret,
		callbackURL: facebookAuth.callbackURL,
		profileFields: ['id', 'picture.type(large)', 'emails', 'name'],
	};

	// callback function for facebook passport strategy
	var fbCallback = function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			console.log('this is the fbCallback function\n')
			User.findOne({'facebook.id': profile.id}, function(err, user) {
				if (err) return done(err, null);
				if (user) {
					console.log('current user is ',user.facebook.name);
					return done(null, user);
				}
				if (!user) {
					var newUser = new User();
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					newUser.facebook.id = profile.id;

					newUser.save(function(err){
						if (err) return done(err, null);
						return done(null, newUser);
					})
				}
			})
		})
	};

	passport.serializeUser(function(user, cb) {
		console.log('serializing user', user.facebook.name);
		cb(null, user);
	});

	passport.deserializeUser(function(obj, cb) {
		console.log('deserializing user');
		cb(null, obj);
	});


	// this is the strategy used to authenticate a user
	var strategy = new facebookStrategy(fbOpts, fbCallback);
	passport.use(strategy);
}