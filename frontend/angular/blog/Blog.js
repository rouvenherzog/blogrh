var BlogModule = angular.module(
	'rouvenherzog.Blog',
	['ngRoute']
);

BlogModule.config([
	'$routeProvider',
	'$locationProvider',
	function( $routeProvider, $locationProvider ) {
		var base = document.getElementsByTagName('base').item(0).getAttribute('href') + '/blog';
		if( window.innerWidth < 768 ) {
			$routeProvider
				.when(base, {
					templateUrl: '/angular/blog/tmpls/index.tmpl',
					controller: 'rouvenherzog.Blog.indexController'
				})
				.when(base + '/:id', {
					templateUrl: '/angular/blog/tmpls/edit.tmpl',
					controller: 'rouvenherzog.Blog.editController'
				});
		} else {
			$routeProvider.when(base + '/:id?', {
				templateUrl: '/angular/blog/tmpls/combined-edit.tmpl',
				controller: 'rouvenherzog.Blog.combinedController'
			});
		}

		// Default 404
		$routeProvider
			.otherwise({
				templateUrl: '/otherwise.tmpl',
				controller: 'asdf'
			});
	}
]);