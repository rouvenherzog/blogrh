var express = require('express');
var router = express.Router();
var Media = require('./models').Media;

router
	.param('id', function( request, response, next, id ) {
		Media
			.findById(id)
			.populate('entry')
			.exec(function(error, media) {
			if( error )
				console.log(error);

			if( media == null )
				console.log("MEDIA NULL");

			request.media = media;
			next();
		});
	});

router.route('/media')
		.get(function( request, response ) {
			Media
				.find()
				.populate('entry')
					.exec(function(error, media) {
					if( error )
						console.log(error);

					response.json(media);
				});
			})

		.post(function( request, response ) {
			var file = request.files.file;
			Media.fromFile(file, {
				title: request.body.title,
				uploadRoot: request.app.get('uploadroot'),
				description: request.body.description,
				tags: request.body.tags && request.body.tags.split(','),
				uploaded_by: request.user
			}).then(function( media ) {
				response.json(media);
			});
		})

router.route('/media/:id')
	.get(function( request, response ) {
		response.json(request.media);
	})

	.put(function( request, response ) {
		request.media.set({
			title: request.body.title,
			tags: request.body.tags,
			description: request.body.description
		});
		request.media.save(function(error) {
			if( error )
				console.log(error);

			response.json(request.media);
		});
	})

	.delete(function( request, response ) {
		var entry = request.media.entry;
		request.media.remove(function( error ) {
			if( error )
				console.log(error);

			if( entry ) {
				entry.media.pull(request.media._id);
				entry.save(function( error ) {
					if( error )
						console.log(error);

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