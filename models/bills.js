var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dbFunctions = require('../db_functions/users');

var billSchema = new Schema({
    payee: { type: String, ref: 'User' },
    payer: { type: String, ref: 'User' },
    title: String,
    body: String,
    amount: Number,
    date: Date
});

// pre-save middleware
billSchema.pre('validate', function(next) {
	var emptyField = new Error('one of the required fields is empty');
	if(!this.payee || !this.payer || !this.title || !this.amount){
		next(emptyField);
	}
	// verify that both users exist
	dbFunctions.verifyUsers(this.payer, this.payee, function(err, both) {
		if (err) next(err);
		if (!both) next(err);
	});
});

billSchema.pre('save', function(next) {
	this.date = new Date();
	next();
});


module.exports = mongoose.model('Bill', billSchema);