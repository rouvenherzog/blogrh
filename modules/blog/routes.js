var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var prefix = '';

router
	.get('/:id?', function( request, response ) {
		response.render('blog/views/index');
	})

module.exports = function(app) {
	prefix = '/' + app.get('backend').name + '/blog/';
	app.use(prefix, router);
};