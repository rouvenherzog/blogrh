UserModule.service('rouvenherzog.User.UserService', [
	'$q',
	'$http',
	function( $q, $http ) {
		var defaults = {
			'email': '',
			'name': '',
			'username': ''
		};
		var user = {};
		var clean = {};

		$http
			.get('/admin/api/users')
			.success(function( data ) {
				copy(user, data);
				copy(clean, data);
			});

		var copy = function( to, from ) {
			for( var key in defaults )
				to[key] = from[key] || to[key] || defaults[key];
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
				errors[key] = message;
			};

			if( !user.email ) set_error('email', 'Please specify an email address');
			if( !user.name ) set_error('name', 'Please specify a name');
			if( !user.username ) set_error('username', 'Please specify a username');
			if( !user.old_password ) set_error('old_password', 'Please insert your old password');

			if( user.change_password ) {
				if( !user.new_password ) set_error('new_password', 'Please specify a new password');
				if( user.new_password != user.repeat_password ) set_error('new_password', 'The passwords have to match');
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

						a.resolve();
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