var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
	.get(function( request, response ) {
		if( request.isAuthenticated() ) {
			return response.redirect(request.query.nect || '/admin');
		} else {
			return response.render('users/views/login', {
				backgroundNumber: parseInt(Math.random() * 3)+1,
				error: request.flash('error'),
				next: request.query.next,
				username: request.query.username,
				password: request.query.password
			});
		}
	})
	.post(
		function( request, response, next ) {
			var nextpath = request.query.next;
			if( nextpath.length == 0 ) nextpath = null;

			var successRoute = nextpath || '/admin';
			var failureRoute = '/admin/login';
			if( nextpath )
				failureRoute += '?next=' + nextpath;

			passport.authenticate( 'local', {
				successRedirect: successRoute,
				failureRedirect: failureRoute,
				failureFlash: true
			})( request, response, next );
		}
	);

router.route('/logout')
	.get(function( request, response ) {
		request.logout();
		response.redirect('/admin/login');
	});

module.exports = function(app) {
	app.use('/admin/', router);
};