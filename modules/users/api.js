var express = require('express');
var router = express.Router();
var User = require('./models').User;

router.route('/users')
	.get(function( request, response ) {
		response.json(request.user);
	})
	.put(function( request, response ) {
		var data = request.body;
		var user = request.user;

		var raise_error = function( error ) {
			response.status(400).json(error);
		};

		if( !user.validPassword(data.old_password) )
			return raise_error({old_password: 'Wrong password.'});
		if( data.new_password ){
			if( data.new_password != data.repeat_password )
				return raise_error({'new_password': 'Passwords don\'t match'});
			else
				user.setPassword(data.new_password);
		}

		if( !data.username )
			return raise_error({'username': 'Specify a username'});
		if( !data.email )
			return raise_error({'email': 'Specify an email'});

		user.name = data.name;
		if( data.locale )
			user.locale = data.locale;

		if( data.email != user.email || data.username != user.username ) {
			User.where(
				{email: data.email},
				{username: data.username}
			)
			.where('_id').ne(user._id)
			.findOne(function(err, existing) {
				if( existing ) {
					return raise_error({
						username: existing.username == data.username ? 'Username already taken.' : null,
						email: existing.email == data.email ? 'Email already taken' : null
					});
				}

				user.set({
					email: data.email,
					username: data.username
				});
				user.save(function( err ) {
					if( err )
						console.log(err);

					response.json(user);
				})
			})
		} else {
			user.save(function( err ) {
				if( err )
					console.log(err);

				response.json(user);
			})
		}
	});

module.exports = function(app) {
	app.use(app.get('backend').api, router);
};