var Bill = require('../models/bills');
var userFuncs = require('./users');
var Mongoose = require('mongoose');


// intended to be used to find a bill that belongs to a particular user (from only)
exports.findFrom = function(username, callback) {
	// Bill.find({payer: username}, function(err, users){
	// 	if (err){
	// 		callback(err, null);
	// 	}
	// 	callback(null, users);
	// })
	Bill.find({payer: username})
	.then(function(bills) {
		
	})
};

// intended to be used to find a bill that belongs to a particular user (to only)
exports.findTo = function(username, callback) {
	Bill.find({payee: username}, function(err, bills){
		if (err){
			callback(err, null);
		}
		callback(null, bills);
	})
};

// intended to be used by form to create new bill
exports.create = function(bill, callback) {
	var newBill = new Bill(bill);
	
	console.log(newBill.payee);

	newBill.save(function(err, done){
		if (err){
			return callback(err, null);
		}
		console.log('Saved new bill');
		return callback(null, 201);
	})
};

// intended to be used to delete existing bill
exports.remove = function() {
	
};

// intended to be used to update existing user
exports.update = function() {
	
};