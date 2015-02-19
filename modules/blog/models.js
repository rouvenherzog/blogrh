var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('./helpers');

var EntrySchema = new Schema({
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	created_by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	modified_by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	modified_at: Date,

	published_at: Date,
	published: {
		type: Boolean,
		default: false
	},

	title: String,
	summery: String,
	keywords: [String],
	rendered: String,
	delta: {},

	media: [{
		type: Schema.Types.ObjectId,
		ref: 'Media'
	}]
});

EntrySchema.pre('save', function(next) {
	if( this.delta ) {
		this.markModified('delta');
		this.rendered = helpers.render_delta(this.delta);
	}

	this.modified_at = Date.now();
	next();
});

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = {
	Entry: Entry
};