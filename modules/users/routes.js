var express = require('express');
var router = express.Router();
var passport = require('passport');

router
	.route('/login')
		.get(function( request, response ) {
			response.render('users/views/login', {
				backgroundNumber: parseInt(Math.random() * 4),
				error: request.flash('error')
			});
		})
		.post(
			passport.authenticate( 'local', {
				successRedirect: '/admin',
				failureRedirect: '/admin/login',
				failureFlash: true
			})
		);

module.exports = function(app) {
	app.use('/admin', router);
};