var express = require('express');
var router = express.Router();

router
	.get('/', function( request, response ) {
		response.render('dashboard/index');
	})

module.exports = function(app) {
	var prefix = '/' + app.get('backend').name + '/';
	app.use(prefix, router);
};