var express = require('express');
var router = express.Router();
var Tag = require('./models').Tag;

router
	.param('id', function( request, response, next, id ) {
		Tag.findById(id).exec(function(error, tag) {
			if( error )
				console.log(error);

			if( tag == null )
				console.log("TAG NULL");

			request.tag = tag;
			next();
		});
	});

router.route('/tags')
	.get(function( request, response ) {
		Tag
			.find()
			.exec(function(error, tags) {
				if( error )
					console.log(error);

				response.json(tags);
			});
	})
	.post(function( request, response ) {
		var tag = new Tag(request.body);
		tag.save(function(error) {
			if( error )
				console.log(error);

			response.json(tag);
		});
	});

router.route('/tags/:id')
	.delete(function( request, response ) {
		request.tag.remove(function( error ) {
			if( error )
				console.log(error);

			response.json({})
		})
	});

module.exports = function(app) {
	app.use('/' + app.get('backend').api, router);
};