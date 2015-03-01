var App = angular.module(
	'rouvenherzog',
	[
		'rouvenherzog.Dashboard',
		'rouvenherzog.Blog',
		'rouvenherzog.Notification',
		'rouvenherzog.Media',
		'rouvenherzog.Tag',
		'rouvenherzog.User',

		'pascalprecht.translate'
	]
);

App.config([
	'$locationProvider',
	'$translateProvider',
	'$httpProvider',
	function( $locationProvider, $translateProvider, $httpProvider ) {
		$locationProvider.html5Mode(true);

		$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

		$translateProvider.useStaticFilesLoader({
			prefix: '/static/admin/locales/',
			suffix: '.json'
		});
		var preferredLanguage = document.getElementsByTagName('base').item(0).getAttribute('language');
		$translateProvider.preferredLanguage(preferredLanguage);
	}
]);