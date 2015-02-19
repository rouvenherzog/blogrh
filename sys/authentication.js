var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('backend/modules/users/models').User;

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
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(error, user){
			done(null, user);
		});
	});

	app.use(passport.initialize());
	app.use(passport.session());
};