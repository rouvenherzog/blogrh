var express = require('express');
var router = express.Router();

router
	.get('/', function( request, response ) {
		response.render('dashboard/views//index');
	})

module.exports = function(app) {
	app.use('/admin/', router);
};