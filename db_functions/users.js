var User = require('../models/users');

// intended to be used to find new user to create bill
exports.findOne = function(username, callback) {
	User.findOne({username: username})
	.then(function(user) {
		if (user){
			console.log('found user ', user.username)
			return callback(null, user);
		}
		var noUser = new Error('no such user')
		return callback(noUser, null);
	})
	.catch(function(err) {
		console.log('err is ', err)
		return callback(err, null);
	})
};

exports.verifyUsers = function(user1, user2, callback) {
	User.find({username: {$in: [user1, user2]}})
		.then(function(users) {
			if (users.length === 2){
				callback(null, true);
			}
			var invalidUser = new Error('one or both users were not found');
			callback(invalidUser, false);
		})
		.catch(function(err) {
			callback(err, false);
		})
}

// intended to be used by form to create new user
exports.create = function(user, callback) {
	User.findOne({username: user.username})
	.then(function(user){
		if(!user){
			console.log('creating new user')
			var newUser = new User(user);
			console.log(user)
			newUser.save()
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