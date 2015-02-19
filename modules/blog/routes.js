var express = require('express');
var router = express.Router();
var Entry = require('./models').Entry;
var passport = require('passport');

router
	.use(passport.authenticate('local', { failureRedirect: '/admin/login' }))
	.get(
		'/:id?',
		function( request, response ) {
			response.render('blog/views/index');
		}
	);

module.exports = function(app) {
	app.use('/admin/blog/', router);
};