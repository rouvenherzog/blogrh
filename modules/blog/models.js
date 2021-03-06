var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var helpers = require('./helpers');
var q = require('q');
var _ = require('underscore');

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
	keywords: String,
	isLongArticle: Boolean,
	summary: {
		delta: [],
		rendered: String
	},
	body: {
		delta: [],
		rendered: String
	},

	media: [{
		type: Schema.Types.ObjectId,
		ref: 'Media'
	}],

	temp: {}
});

EntrySchema.statics.query = function( account, args ) {
	if( !account ) throw(new Error("Account has to be given."));

	args = args || {};
	args = _.extend({
		account: account,
		populate: ['media']
	}, args);

	var populate = args.populate;
	delete args['populate'];

	var sort = args.sort;
	delete args['sort'];

	var a = q.defer();
	var query = Entry.find(args);
	for( var index in populate ) {
		query = query.populate(populate[index]);
	}

	if( sort )
		query = query.sort(sort);

	query.exec(function( err, result ) {
			if( err )
				return a.reject(err);

			if( args._id && typeof args._id == 'string' )
				result = result.length ? result[0] : null;

			a.resolve(result);
		});

	return a.promise;
};

EntrySchema.methods.autosave = function( status ) {
	this.temp = status;
	this.markModified('temp');
	this.skipRender = true;
};

EntrySchema.pre('save', function(next) {
	if( this.skipRender )
		return next();

	if( this.body.delta ) {
		this.markModified('body');
		this.body.rendered = helpers.render_delta(this.body.delta);
	}

	this.markModified('temp');

	var count = 0;
	var summaryDelta = [];
	for( var index = 0; index < this.body.delta.length; index++ ) {
		summaryDelta.push(_.clone(this.body.delta[index]));
		if( (count+=this.body.delta[index].insert.length) >= 700 )
			break;
	}

	this.isLongArticle = count >= 700;
	if( this.isLongArticle ) {
		if( this.summary.delta.length == 0 ) {
			var lastop = summaryDelta[summaryDelta.length-1];
			var lasttext = lastop.insert;
			var matchlength = lasttext.length - count + 700;

			var re = new RegExp("((.|\n){0,"+matchlength+"})(?:\s)");
			var match = re.exec(lasttext);
			match = match && match[0] || '';
			lastop.insert = match + "...";

			this.summary.delta = summaryDelta;
		}

		this.markModified('summary');
		this.summary.rendered = helpers.render_delta(this.summary.delta);
	}

	this.modified_at = Date.now();
	next();
});

var Entry = mongoose.model('Entry', EntrySchema);

module.exports = {
	Entry: Entry
};