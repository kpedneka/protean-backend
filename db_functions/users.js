var User = require('../models/users');

// intended to be used to find new user to create bill
exports.findOne = function(username, callback) {
	User.findOne({username: username})
	.then(function(user) {
		console.log('found user ', user.username)
		return callback(null, user);
	})
	.catch(function(err) {
		console.log('err is ', err)
		return callback(err, null);
	})
};

// intended to be used by form to create new user
exports.create = function(user, callback) {
	User.find({username: user.username})
	.then(function(user){
		if(!user){
			console.log('creating new user')
			var newUser = new User(user);
			user.save()
			return callback(null, user);
		} else {
			var err = new Error('username already exists')
			return callback(err, null);
		}
	})
	.catch(function(err) {
		return callback(err, null);
	})
};

exports.findAndAdd = function (username, billId, callback) {
	User.findOne({username: username}, function(err, user) {
		if (err) {
			return callback(err, null);
		}
		if (users.length !== 0) {
			// adds bill id to bills array, returns user to callback
			user.bills.push(billId);
			callback(null, user);
		}
	});
};

// intended to be used to delete existing bill
exports.remove = function() {
	
};

// intended to be used to update existing user
exports.update = function() {
	
};