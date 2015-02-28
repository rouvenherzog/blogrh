UserModule.service('rouvenherzog.User.UserService', [
	'$q',
	'$http',
	'$translate',
	function( $q, $http, $translate ) {
		var defaults = {
			'email': '',
			'name': '',
			'username': '',
			'locale': ''
		};
		var user = {};
		var clean = {};
		var locale = null;

		$http
			.get('/admin/api/users')
			.success(function( data ) {
				locale = data.locale;

				copy(user, data);
				copy(clean, data);
			});

		var copy = function( to, from ) {
			for( var key in defaults )
				to[key] = from[key] || to[key] || defaults[key];
		};

		this.getLocale = function() {
			return locale;
		};

		this.getClean = function() {
			return clean;
		}

		this.get = function() {
			return user;
		};

		this.clear = function(){
			copy(user, clean);
		};

		this.validate = function( field ) {
			var errors = {failed: false};
			var failed = false;

			var set_error = function( key, message ) {
				if( field && key != field ) return;

				errors['failed'] = true;
				$translate(message).then(function(translation) {
					errors[key] = translation;
				});
			};

			if( !user.email ) set_error('email', 'User.Errors.SpecifyEmail');
			if( !user.name ) set_error('name', 'User.Errors.SpecifyName');
			if( !user.username ) set_error('username', 'User.Errors.SpecifyUsername');
			if( !user.old_password ) set_error('old_password', 'User.Errors.SpecifyOldPassword');

			if( user.change_password ) {
				if( !user.new_password ) set_error('new_password', 'User.Errors.SpecifyNewPassword');
				if( user.new_password != user.repeat_password ) set_error('new_password', 'User.Errors.PasswordsHaveToMatch');
			};

			return errors;
		};

		this.save = function() {
			var a = $q.defer();
			var errors = this.validate();
			if( !errors.failed ) {
				$http
					.put(
						'/admin/api/users',
						user
					)
					.success(function(data) {
						copy(user,data);
						copy(clean, user);

						a.resolve( data );
					})
					.error(function(data) {
						a.reject(data);
					})
			} else {
				a.reject(errors)
			}

			return a.promise;
		};
	}
]);