var express = require('express');
var router = express.Router();
var configuration = require('../../sys/config').configuration;

router
	.get('/', function( request, response ) {
		response.render('dashboard/views/index', {
			piwik: configuration.piwik ? true : false
		});
	})

module.exports = function(app) {
	app.use('/admin/', router);
};