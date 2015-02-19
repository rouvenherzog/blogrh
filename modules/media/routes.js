var express = require('express');
var router = express.Router();

router
	.get('/:id?', function( request, response ) {
		response.render('media/views/index');
	})

module.exports = function(app) {
	app.use('/admin/media/', router);
};