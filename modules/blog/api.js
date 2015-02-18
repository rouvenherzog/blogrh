var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var Media = require('backend/modules/media/models').Media;
var prefix_views = '';

router
	.param('id', function( request, response, next, id ) {
		Entry
			.findById(id)
			.populate('media')
			.exec(function(error, entry) {
				if( error )
					console.log(error);

				if( entry == null )
					console.log("ENTRY NULL");

				request.entry = entry;
				next();
			});
	})

	.param('mediaid', function( request, response, next, id ) {
		Media
			.findById(id)
			.exec(function(error, media) {
				if( error )
					console.log(error);

				if( media == null )
					console.log("MEDIA NULL");

				request.media = media;
				next();
			});
	});

router.route('/blog')
		.get(function( request, response ) {
			Entry
				.find()
				.populate('media')
				.exec(function(error, entries) {
					if( error )
						console.log(error);

					response.json(entries);
				});
		})

		.post(function( request, response ) {
			var entry = new Entry();
			entry.save(function(error) {
				if( error )
					console.log(error);

				response.json(entry);
			});
		})

router.route('/blog/:id')
	.get(function( request, response ) {
		response.json(request.entry);
	})

	.put(function( request, response ) {
		request.entry.set({
			title: request.body.title,
			summery: request.body.summery,
			keywords: request.body.keywords,
			delta: request.body.delta
		});
		request.entry.save(function(error) {
			if( error )
				console.log(error);

			response.json(request.entry);
		});
	})

	.delete(function( request, response ) {
		request.entry.remove(function( error ) {
			if( error )
				console.log(error);

			response.json({})
		})
	});

router.route('/blog/:id/publish')
	.put(function( request, response ) {
		request.entry.set({
			published: !request.entry.published
		});
		request.entry.save(function(error) {
			if( error )
				console.log(error);

			response.json(request.entry);
		});
	});

router.route('/blog/:id/media')
	.post(function( request, response ) {
		var file = request.files.file;
		console.log("request", request.body);
		Media.fromFile(file, {
			title: request.body.title,
			tags: request.body.tags,
			uploadRoot: request.app.get('uploadroot'),
			entry: request.entry
		}).then(function( media ) {
			request.entry.media.push(media);
			request.entry.save(function(error) {
				response.json(media);
			});
		});
	});

router.route('/blog/:id/media/:mediaid')
	.delete(function( request, response ) {
		request.media.remove(function( error ) {
			if( error )
				console.log(error);

			request.entry.media.pull(request.media._id);
			request.entry.save(function(error) {
				if( error )
					console.log(error);

				response.json({});
			});
		});
	});

module.exports = function(app) {
	prefix_views = '/' + app.get('backend').name + '/blog/';
	app.use('/' + app.get('backend').api, router);
};