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

		$scope.publish = function() {
			$scope.entry
				.publish()
				.then(function() {
					saved_state = $scope.entry.toJSON();
				});
		};

		$scope.delete = function() {
			BlogService
				.deleteEntry($scope.entry)
				.then(function() {
					$scope.back();
				});
		};

		$scope.back = function() {
			$scope.reset();
			$location.path('/admin/blog');
		};
	}
]);