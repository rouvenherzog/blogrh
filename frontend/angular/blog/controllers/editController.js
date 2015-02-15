BlogModule.controller('rouvenherzog.Blog.editController', [
	'$scope',
	'$routeParams',
	'$location',
	'rouvenherzog.Blog.BlogService',
	function( $scope, $routeParams, $location, BlogService ) {
		var saved_state;
		$scope.entry = undefined;

		BlogService
			.getEntry( $routeParams.id )
			.then(function( entry ) {
				saved_state = entry.toJSON();
				$scope.entry = entry;
			});

		$scope.save = function() {
			$scope.entry
				.save()
				.then(function() {
					saved_state = $scope.entry.toJSON();
				});
		};

		$scope.reset = function() {
			$scope.entry.set( saved_state );
		};

		$scope.togglePublish = function() {
			$scope.entry.publish();
		};

		$scope.back = function() {
			$location.path('/admin/blog');
		};
	}
]);