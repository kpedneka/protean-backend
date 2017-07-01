var Bill = require('../models/bills');
var userFuncs = require('./users');
var Mongoose = require('mongoose');


// intended to be used to find a bill that belongs to a particular user (from only)
exports.findMyBills = function(username, callback) {
	console.log('here are my bills')
	Bill.find({ $or: [ {payer: username}, {payee: username}]})
	// desc means latest first
	.sort({date: 'desc'})
	.then(bills => {
		return callback(null, bills);
	})
	.catch(err => {
		return callback(err, null);
	});
}

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