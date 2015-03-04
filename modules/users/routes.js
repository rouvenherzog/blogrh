var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
	.get(function( request, response ) {
		response.render('users/views/login', {
			backgroundNumber: parseInt(Math.random() * 3)+1,
			error: request.flash('error'),
			next: request.query.next
		});
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