var gm = require('gm').subClass({imageMagick: true});
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var q = require('q');

var MediaSchema = new Schema({
	uploaded_at: {
		type: Date,
		default: Date.now
	},
	path: String,
	title: String,

	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}]
});

MediaSchema.statics.fromFile = function( file, args ) {
	var a = q.defer();

	gm(file.buffer, file.name).size(
		{bufferStream: true},
		function( err, dimension ) {
			if( dimension.height > 512 || dimension.width > 512 )
				this.resize(512, 512);

			this.write(file.path, function(err) {
				var media = new Media({
					path: args.uploadRoot ? args.uploadRoot + '/' + file.name : file.name,
					title: args.title || "",
					tags: args.tags || []
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