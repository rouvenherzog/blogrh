BlogModule.controller('rouvenherzog.Blog.combinedController', [
	'$scope',
	'$location',
	'$routeParams',
	'rouvenherzog.Blog.BlogService',
	function( $scope, $location, $routeParams, BlogService ) {
		var saved_state = undefined;

		$scope.selected_entry = null;
		$scope.entries = BlogService.getEntries();

		if( $routeParams.id ) {
			BlogService
				.getEntry( $routeParams.id )
				.then(function( entry ) {
					saved_state = entry.toJSON();
					$scope.selected_entry = entry;
				});
		}

		$scope.open = function( entry ) {
			$scope.selected_entry = entry;
			$location.path("/admin/blog/" + (entry ? entry._id : ''));
		};

		$scope.save = function() {
			$scope.selected_entry.save();
		};

		$scope.publish = function() {
			$scope.selected_entry.publish();
		};

		$scope.delete = function() {
			BlogService
				.deleteEntry($scope.selected_entry)
				.then(function() {
					$scope.open(null);
				});
		};

		$scope.create = function() {
			BlogService
				.createEntry()
				.then(function( entry ) {
					$location.path('/admin/blog/' + entry._id );
				});
		};
	}
]);