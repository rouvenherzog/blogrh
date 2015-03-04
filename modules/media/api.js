var express = require('express');
var router = express.Router();
var Media = require('./models').Media;
var configuration = require('../../sys/config').configuration;

router
	.param('id', function( request, response, next, id ) {
		Media
			.query(configuration.account, { _id: id })
			.then(function(media) {
				if( media == null ) {
					request.status = 404;
					return next(new Error("Media not found."));
				}

				request.media = media;
				next();
			}, function( error ) {
				return next(error);
			});
	});

router.route('/media')
		.get(function( request, response, next ) {
			Media
				.query(configuration.account)
				.then(function(result) {
					response.json(result);
				}, function( error ) {
					return next(error);
				})
		})

		.post(function( request, response, next ) {
			var file = request.files.file;
			try {
				Media.fromFile(file, {
					title: request.body.title,
					uploadRoot: configuration.uploadroot,
					description: request.body.description,
					tags: request.body.tags && request.body.tags.split(','),
					uploaded_by: request.user
				}).then(function( media ) {
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

			response.json(request.media);
		});
	})

	.delete(function( request, response, next ) {
		var entry = request.media.entry;
		request.media.remove(function( error ) {
			if( error )
				return next(error);

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