var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new Schema({
    name: String,
    username: {type: String, unique: true},
    password: String
});

// maybe add some pre-save middleware here
userSchema.pre('save', function(next) {
	var err = new Error('missing some fields, check the form you submitted');
	if (!this.name || !this.username || !this.password){
		return next(err);
	}
	// encrypt password
	const saltRounds = 10;
	var hash = bcrypt.hashSync(this.password, saltRounds);
	this.password = hash;

	next();
});

module.exports = mongoose.model('User', userSchema);