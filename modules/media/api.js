var express = require('express');
var router = express.Router();
var Media = require('./models').Media;

router
	.param('id', function( request, response, next, id ) {
		Media.findById(id).exec(function(error, media) {
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
			Media.find().exec(function(error, media) {
				if( error )
					console.log(error);

				response.json(media);
			});
		})

		.post(function( request, response ) {
		})

router.route('/media/:id')
	.get(function( request, response ) {
		response.json(request.media);
	})

	.put(function( request, response ) {
		request.media.set({
			title: request.body.title,
			tags: request.body.tags
		});
		request.media.save(function(error) {
			if( error )
				console.log(error);

			response.json(request.media);
		});
	})

	.delete(function( request, response ) {
		request.media.remove().then(function( error ) {
			if( error )
				console.log(error);

			response.json({});
		});
	});

module.exports = function(app) {
	app.use('/' + app.get('backend').api, router);
};