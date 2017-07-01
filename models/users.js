var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new Schema({
	facebook: {
		id: String,
		accessToken: String,
		name: String,
		email: String
	}
});

// maybe add some pre-save middleware here
userSchema.pre('save', function(next) {
	console.log("In pre save function")

	// var err = new Error('missing some fields, check the form you submitted');
	// if (!this.facebook.name || !this.facebook.id || !this.facebook.email || !this.facebook.accessToken){
	// 	return next(err);
	// }
	console.log('success')
	next();
});

module.exports = mongoose.model('User', userSchema);