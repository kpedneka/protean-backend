var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dbFunctions = require('../db_functions/users');
// maybe add bcrypt here to hash password in pre-save?

var billSchema = new Schema({
    payee: { type: String, ref: 'User' },
    payer: { type: String, ref: 'User' },
    title: String,
    body: String,
    amount: Number,
});

// pre-save middleware
billSchema.pre('save', function(next) {
	var err = new Error('missing some fields, check the form you submitted');
	if (!this.payee || !this.payer || !this.title || !this.amount){
		next(err);
	}
	dbFunctions.findOne(this.payee, function(err, user) {
		if (!user){
			next(err);
		}
	});
	dbFunctions.findOne(this.payer, function(err, user) {
		if (!user){
			next(err);
		}
	});

	next();
});


module.exports = mongoose.model('Bill', billSchema);