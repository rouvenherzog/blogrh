var express = require('express');
var router = express.Router();
var Tag = require('./models').Tag;
var configuration = require('../../sys/config').configuration;

router
	.param('id', function( request, response, next, id ) {
		Tag
			.query(configuration.account, { _id: id })
			.then(function(tag) {
				if( tag == null ) {
					request.status = 404;
					return next(new Error("Tag not found."));
				}

				request.tag = tag;
			}, function( error ) {
				return next(error);
			});
	});

router.route('/tags')
	.get(function( request, response ) {
		Tag
			.query(configuration.account)
			.then(function( result ) {
				response.json(result);
			}, function( error ) {
				return next(error);
			});
	})
	.post(function( request, response, next ) {
		var tag = new Tag({
			name: request.body,
			account: configuration.account
		});
		tag.save(function(error) {
			if( error )
				return next(error);

			response.json(tag);
		});
	});

router.route('/tags/:id')
	.delete(function( request, response, error ) {
		request.tag.remove(function( error ) {
			if( error )
				return next(error);

			response.json({})
		})
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};