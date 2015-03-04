var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var AccountSchema = new Schema({
	name: String
});

var UserSchema = new Schema({
	name: String,
	username: String,
	email: String,
	password: String,
	active: Boolean,
	locale: {
		type: String,
		default: 'en'
	},

	account: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	}
});

UserSchema.methods.validPassword = function( password ) {
	var hash = crypto.createHash('sha512');
		hash.update(password, 'utf8');

	return this.password == hash.digest('hex');
};

UserSchema.methods.setPassword = function( password ) {
	var hash = crypto.createHash('sha512');
		hash.update(password, 'utf8');

	this.password = hash.digest('hex');
};

UserSchema.set( 'toJSON', {
	transform: function( doc, ret, options ) {
		delete ret['password'];
	}
});

var User = mongoose.model('User', UserSchema);
var Account = mongoose.model('Account', AccountSchema);

module.exports = {
	User: User,
	Account: Account
};