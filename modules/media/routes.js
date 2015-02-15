var express = require('express');
var router = express.Router();
var prefix = '';

router
	.get('/:id?', function( request, response ) {
		response.render('media/views/index');
	})

module.exports = function(app) {
	prefix = '/' + app.get('backend').name + '/media/';
	app.use(prefix, router);
};