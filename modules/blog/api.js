var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var Media = require('../media/models').Media;

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
			var entry = new Entry({
				created_by: request.user,
				account: request.user.account
			});
			entry.save(function(error) {
				if( error )
					console.log(error);

				response.json(entry);
			});
		});

router.route('/blog/:id')
	.get(function( request, response ) {
		response.json(request.entry);
	})

	.put(function( request, response ) {
		console.log(request.body, request.body.specifiedSummary)
		request.entry.set({
			title: request.body.title,
			summary: {
				delta: request.body.summary.delta
			},
			keywords: request.body.keywords,
			body: {
				delta: request.body.body.delta
			},
			specifiedSummary: request.body.specifiedSummary,
			modified_by: request.user
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
			published: !request.entry.published,
			published_at: new Date(),
			modified_by: request.user
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
		Media.fromFile(file, {
			title: request.body.title,
			tags: request.body.tags && request.body.tags.split(','),
			uploadRoot: request.app.get('uploadroot'),
			description: request.body.description,
			entry: request.entry,
			uploaded_by: request.user
		}).then(function( media ) {
			request.entry.media.push(media);
			request.entry.save(function(error) {
				if( error )
					throw(error);

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
	app.use(app.get('backend').api, router);
};