var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../modules/users/models').User;

module.exports = function( app ) {
	// Set up authentication
	passport.use(new LocalStrategy(
		function( username, password, done ) {
			User
				.find()
				.or([{username: username}, {email: username}])
				.findOne(function (err, user) {
					if( err )
						return done(err);

					if( !user )
						return done(null, false, { message: 'Incorrect username.' });

					if( !user.validPassword(password) )
						return done(null, false, { message: 'Incorrect password.' });

					return done(null, user);
				});
		}
	));

	passport.serializeUser(function(user, done) {
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		console.log("DES", id);
		User.findById(id, function(error, user){
			return done(null, user);
		});
	});

	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/admin', function(req, res, next) {
		var auth = req.isAuthenticated();
		var loginrequest = (req.originalUrl.indexOf('/admin/login') == 0);
		var apirequest = (req.originalUrl.indexOf('/admin/api') == 0);

		if( loginrequest ) {
			next();
		} else if( !auth ) {
			if( apirequest )
				return res.send(400, 'Not authorized');
			else
				return res.redirect(
					'/admin/login?next='+req.originalUrl
				);
		} else {
			next();
		}
	})
};