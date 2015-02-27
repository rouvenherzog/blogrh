var App = angular.module(
	'rouvenherzog',
	[
		'rouvenherzog.Dashboard',
		'rouvenherzog.Blog',
		'rouvenherzog.Notification',
		'rouvenherzog.Media',
		'rouvenherzog.Tag',
		'rouvenherzog.User'
	]
);

App.config([
	'$locationProvider',
	function( $locationProvider ) {
		$locationProvider.html5Mode(true);
	}
]);