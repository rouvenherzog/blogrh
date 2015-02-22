var gm = require('gm').subClass({imageMagick: true});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');
var q = require('q');

var MediaSchema = new Schema({
	account: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: true
	},
	uploaded_by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	uploaded_at: {
		type: Date,
		default: Date.now
	},
	localPath: String,
	path: String,
	title: String,

	entry: {
		type: Schema.Types.ObjectId,
		ref: 'Entry'
	},

	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}]
});

MediaSchema.pre('remove', function(next) {
	if( !this.localPath ) {
		next();
		return;
	}

	fs.unlink(this.localPath, function(err) {
		if( err )
			console.log(err);

		next();
	});
});

MediaSchema.set( 'toJSON', {
	transform: function( doc, ret, options ) {
		delete ret['localPath'];
	}
});

MediaSchema.statics.fromFile = function( file, args ) {
	var a = q.defer();

	console.log("RESIZE AND SAVE IMAGE");
	gm(file.buffer, file.name).size(
		{bufferStream: true},
		function( err, dimension ) {
			if( dimension.height > 512 || dimension.width > 512 )
				this.resize(512, 512);

			this.write(file.path, function(err) {
				var media = new Media({
					localPath: file.path,
					path: args.uploadRoot ? args.uploadRoot + '/' + file.name : file.name,
					title: args.title || '',
					tags: args.tags || [],
					entry: args.entry || null,
					uploaded_by: args.uploaded_by,
					account: args.uploaded_by.account
				});

				if( !args.skipPersist )
					media.save();

				a.resolve(media);
			});
		}
	);

	return a.promise;
};

var Media = mongoose.model('Media', MediaSchema);

module.exports = {
	Media: Media
};