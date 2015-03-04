var express = require('express');
var router = express.Router();
var configuration = require('../../sys/config').configuration;
var helpers = require('./helpers');

router.route('/dashboard')
	.get(function( request, response ) {
		var cache = configuration.cache;
		var piwik = configuration.piwik;

		if( !piwik )
			return request.json({});

		var key = 'DASHBOARD-CACHE-' + request.user.account;
		cache.get(key, function( err, result ) {
			if( err )
				throw(err);

			if( result )
				response.json(JSON.parse(result));

			else {
				helpers.query(piwik.siteId, piwik.authToken).then(function(result) {
					cache.setex(key, 60*60, result );
					response.json(JSON.parse(result));
				});
			}
		})
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};