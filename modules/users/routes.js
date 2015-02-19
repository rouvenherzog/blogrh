var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
		.get(function( request, response ) {
			response.render('users/views/login', {
				backgroundNumber: parseInt(Math.random() * 4),
				error: request.flash('error'),
				next: request.query.next
			});
		})
		.post(
			function( request, response, next ) {
				var next = request.query.next;
				if( next.length == 0 ) next = null;

				var successRoute = next || '/admin';
				var failureRoute = '/admin/login';
				if( next )
					failureRoute += '?next=' + next;

				console.log(next, successRoute, failureRoute)
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