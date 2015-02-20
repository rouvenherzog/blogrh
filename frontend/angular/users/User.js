UserModule = angular.module('rouvenherzog.User', ['ngRoute']);

UserModule.config([
	'$routeProvider',
	function( $routeProvider ) {
		var base = document.getElementsByTagName('base').item(0).getAttribute('href') + '/profile';
		// Default index
		$routeProvider
			.when(base, {
				templateUrl: '/angular/users/tmpls/edit-form.tmpl',
				controller: 'rouvenherzog.User.userEditController'
			});
	}
]);