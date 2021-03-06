var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var Media = require('../media/models').Media;
var configuration = require('../../sys/config').configuration;

router
	.param('id', function( request, response, next, id ) {
		Entry
			.query( configuration.account, { _id: id })
			.then(
				function( entry ) {
					if( entry == null ) {
						request.status = 404;
						return next(new Error("Entry not found."));
					}

					request.entry = entry;
					next();
				},
				function( error ) {
					return next(error)
				}
			);
	})

	.param('mediaid', function( request, response, next, id ) {
		Media
			.findById(id)
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

router.route('/blog')
		.get(function( request, response, next ) {
			Entry
				.query(configuration.account)
				.then(function( result ) {
					response.json( result );
				}, function( error ) {
					return next(error);
				});
		})

		.post(function( request, response, next ) {
			var entry = new Entry({
				created_by: request.user,
				account: request.user.account
			});
			entry.save(function(error) {
				if( error )
					return next(error);

				response.json(entry);
			});
		});

router.route('/blog/:id')
	.get(function( request, response, next ) {
		response.json(request.entry);
	})

	.put(function( request, response ) {
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
			modified_by: request.user,
			temp: null
		});
		request.entry.save(function(error) {
			if( error )
				return next(error);

			response.json(request.entry);
		});
	})

	.delete(function( request, response, next ) {
		request.entry.remove(function( error ) {
			if( error )
				return next(error);

			response.json({})
		})
	});

router.route('/blog/:id/publish')
	.put(function( request, response, next ) {
		request.entry.set({
			published: !request.entry.published,
			published_at: new Date(),
			modified_by: request.user
		});
		request.entry.save(function(error) {
			if( error )
				return next(error);

			response.json(request.entry);
		});
	});

router.route('/blog/:id/autosave')
	.delete(function( request,response, next) {
		request.entry.temp = null;
		request.entry.save(function(error) {
			response.json();
		});
	})
	.put(function( request, response, next ) {
		request.entry.autosave({
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
				return next(error);

			response.json(request.entry);
		});
	});

router.route('/blog/:id/media')
	.post(function( request, response, next ) {
		var file = request.files.file;
		Media.fromFile(file, {
			title: request.body.title,
			tags: request.body.tags && request.body.tags.split(','),
			uploadRoot: configuration.uploadroot,
			description: request.body.description,
			entry: request.entry,
			uploaded_by: request.user
		}).then(function( media ) {
			request.entry.media.push(media);
			request.entry.save(function(error) {
				if( error )
					return next(error);

				response.json(media);
			});
		});
	});

router.route('/blog/:id/media/:mediaid')
	.delete(function( request, response, next ) {
		request.media.remove(function( error ) {
			if( error )
				return next(error);

			request.entry.media.pull(request.media._id);
			request.entry.save(function(error) {
				if( error )
					return next(error);

				response.json({});
			});
		});
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};