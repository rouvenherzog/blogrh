var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var prefix_views = '';

router
	.param('id', function( request, response, next, id ) {
		Entry.findById(id).exec(function(error, entry) {
			if( error )
				console.log(error);

			if( entry == null )
				console.log("ENTRY NULL");

			request.entry = entry;
			next();
		});
	});

router.route('/blog')
		.get(function( request, response ) {
			Entry.find().exec(function(error, entries) {
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
		response.json({})
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

module.exports = function(app) {
	prefix_views = '/' + app.get('backend').name + '/blog/';
	app.use('/' + app.get('backend').api, router);
};