var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var q = require('q');
var _ = require('underscore');

var TagSchema = new Schema({
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	name: String
});

TagSchema.statics.query = function( account, args ) {
	if( !account ) throw(new Error("Account has to be given."));

	args = args || {};
	_.extend(args, {
		account: account
	});

	var a = q.defer();
	Tag
		.find(args)
		.exec(function( err, result ) {
			if( err )
				return a.reject(err);

			if( args._id )
				result = result.length ? result[0] : null;

			a.resolve(result);
		});

	return a.promise;
};

var Tag = mongoose.model('Tag', TagSchema);

module.exports = {
	Tag: Tag
};