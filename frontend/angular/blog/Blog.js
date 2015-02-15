var BlogModule = angular.module(
	'rouvenherzog.Blog',
	['ngRoute']
);

BlogModule.config([
	'$routeProvider',
	'$locationProvider',
	function( $routeProvider, $locationProvider ) {
		$locationProvider.html5Mode(true);

		var base = document.getElementsByTagName('base').item(0).getAttribute('href') + '/blog';
		$routeProvider
			.when(base, {
				templateUrl: '/angular/blog/tmpls/index.tmpl',
				controller: 'rouvenherzog.Blog.indexController'
			})
			.when(base + '/:id', {
				templateUrl: '/angular/blog/tmpls/edit.tmpl',
				controller: 'rouvenherzog.Blog.editController'
			})
			.otherwise({
				templateUrl: '/otherwise.tmpl',
				controller: 'asdf'
			});
	}
]);