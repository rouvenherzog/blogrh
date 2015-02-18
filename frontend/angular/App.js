var App = angular.module(
	'rouvenherzog',
	[
		'rouvenherzog.Blog',
		'rouvenherzog.Notification',
		'rouvenherzog.Media',
		'rouvenherzog.Tag'
	]
);

App.config([
	'$locationProvider',
	function( $locationProvider ) {
		$locationProvider.html5Mode(true);
	}
]);