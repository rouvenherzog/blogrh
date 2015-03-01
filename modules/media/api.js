var express = require('express');
var router = express.Router();
var Media = require('./models').Media;
var cache = require('../../sys/config').cache;

var getKey = function( account, id ) {
	return "MEDIA-" + account + (id ? ("-" + id) : "");
};

router
	.param('id', function( request, response, next, id ) {
		Media
			.findById(id)
			.populate('entry')
			.exec(function(error, media) {
				if( error )
					return next(error);

				if( media == null ) {
					request.status = 404;
					return next(new Error("Media not found."));
				}

				request.media = media;
				next();
			});
	});

router.route('/media')
		.get(function( request, response, next ) {
			var key = getKey(request.user.account);
			cache.get(key, function( err, result ) {
				if( result ) {
					response.json(JSON.parse(result));
				} else {
					Media
						.find()
						.populate('entry')
						.exec(function(error, media) {
							if( error )
								return next(error);

							cache.set(key, JSON.stringify(media));
							response.json(media);
						});
				}
			});
		})

		.post(function( request, response, next ) {
			var file = request.files.file;
			try {
				Media.fromFile(file, {
					title: request.body.title,
					uploadRoot: request.app.get('uploadroot'),
					description: request.body.description,
					tags: request.body.tags && request.body.tags.split(','),
					uploaded_by: request.user
				}).then(function( media ) {
					cache.del(getKey(request.user.account));
					response.json(media);
				});
			} catch( error ) {
				return next(error);
			}
		})

router.route('/media/:id')
	.get(function( request, response ) {
		response.json(request.media);
	})

	.put(function( request, response, next ) {
		request.media.set({
			title: request.body.title,
			tags: request.body.tags,
			description: request.body.description
		});
		request.media.save(function(error) {
			if( error )
				return next(error);

			cache.del(getKey(request.user.account));
			response.json(request.media);
		});
	})

	.delete(function( request, response, next ) {
		var entry = request.media.entry;
		request.media.remove(function( error ) {
			if( error )
				return next(error);

			cache.del(getKey(request.user.account));
			if( entry ) {
				entry.media.pull(request.media._id);
				entry.save(function( error ) {
					if( error )
						return next(error);

					response.json({});
				});
			} else {
				response.json({});
			}
		});
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};