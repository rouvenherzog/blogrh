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
	title: String,
	description: String,

	paths: {},

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
	try {
		for( var key in this.paths ) {
			fs.unlinkSync(this.paths[key].localpath);
		}
	} catch( error ) {
		console.log(error);
		// return next(error);
	}

	return next();
});

MediaSchema.set( 'toJSON', {
	transform: function( doc, ret, options ) {
		for( var key in ret.paths ) {
			delete ret.paths[key]['localpath'];
		}
	}
});

MediaSchema.statics.fromFile = function( file, args ) {
	var a = q.defer();

	var fileinfo = (/^(.*\/)(.*)(\..+)$/).exec(file.path);
	var folderpath = fileinfo[1];
	var dimension = {};

	var resize = function(image, width, height, file) {
		var done = q.defer();
		var filename = fileinfo[2] + width + "x" + height + fileinfo[3];
		var localpath = folderpath + filename;

		image.resize(width, height,'>');
		image.write(localpath, function(error) {
			if( error )
				throw(error)

			var iwidth = dimension.width;
			var iheight = dimension.height;
			if( width < dimension.width || height < dimension.height ) {
				iwidth = dimension.widthGtHeight ? width : parseInt(width * dimension.ratio);
				iheight = !dimension.widthGtHeight ? height : parseInt(height / dimension.ratio);
			}

			done.resolve([width, {
				localpath: localpath,
				path: args.uploadRoot ? args.uploadRoot + '/' + filename : filename,
				width: iwidth,
				height: iheight,
				ext: fileinfo[3].slice(1)
			}]);
		})

		return done.promise;
	}

	try {
		var image = gm(file.buffer, file.name);
		image.size(function(error, d) {
			if( error )
				throw(error);

			dimension.width = d.width;
			dimension.height = d.height;
			dimension.ratio = d.width/d.height;
			dimension.widthGtHeight = d.width > d.height;

			var promises = [
				resize(image, 1024, 1024, file),
				resize(image, 256, 256, file),
				resize(image, 64, 64, file)
			];

			q.all(promises).then(function(thumbs) {
				var media = new Media({
					paths: {},
					title: args.title || '',
					tags: args.tags || [],
					description: args.description || '',
					entry: args.entry || null,
					uploaded_by: args.uploaded_by,
					account: args.uploaded_by.account
				});

				for( var index in thumbs ) {
					var size = thumbs[index][0];
					var data = thumbs[index][1];
					media.paths[size] = data;
				}

				media.markModified('paths');

				if( !args.skipPersist )
					media.save();

				a.resolve(media);
			});
		});
	} catch( e ) {
		throw(e);
	}

	return a.promise;
};

var Media = mongoose.model('Media', MediaSchema);

module.exports = {
	Media: Media
};