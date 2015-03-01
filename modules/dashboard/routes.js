var express = require('express');
var router = express.Router();

router
	.get('/', function( request, response ) {
		response.render('dashboard/views/index', {
			piwik: request.app.get('piwik') ? true : false
		});
	})

module.exports = function(app) {
	app.use('/admin/', router);
};