var BlogModule = angular.module(
	'rouvenherzog.Blog',
	['ngRoute']
);

BlogModule.config([
	'$routeProvider',
	'$locationProvider',
	function( $routeProvider, $locationProvider ) {
		var base = document.getElementsByTagName('base').item(0).getAttribute('href') + '/blog';
		$routeProvider.when(base + '/:id?', {
			template: '<ng-include src="template"></ng-include>',
			controller: 'rouvenherzog.Blog.blogController'
		});

		// Default 404
		$routeProvider
			.otherwise({
				templateUrl: '/otherwise.tmpl',
				controller: 'asdf'
			});
	}
]);