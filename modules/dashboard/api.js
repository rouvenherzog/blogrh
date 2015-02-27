var express = require('express');
var router = express.Router();
var cache = require('../../sys/config').cache;
var helpers = require('./helpers');

router.route('/dashboard')
	.get(function( request, response ) {
		cache.get('DASHBOARD-CACHE', function( err, result ) {
			if( err )
				throw(err);

			if( result )
				response.json(JSON.parse(result));

			else
				helpers.query(1, '5a78aad39d2846a3d58845c5514a375d').then(function(result) {
					cache.set('DASHBOARD-CACHE', result);
					response.json(JSON.parse(result));
				});
		})
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};