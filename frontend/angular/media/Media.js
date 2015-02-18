var MediaModule = angular.module(
	'rouvenherzog.Media',
	['ui.select', 'ngRoute']
);

MediaModule.config([
	'$routeProvider',
	'$locationProvider',
	function( $routeProvider, $locationProvider ) {
		var base = document.getElementsByTagName('base').item(0).getAttribute('href') + '/media';
		// Default index
		$routeProvider
			.otherwise({
				templateUrl: '/angular/media/tmpls/media-list.tmpl',
				controller: 'mediaListController'
			});
	}
]);