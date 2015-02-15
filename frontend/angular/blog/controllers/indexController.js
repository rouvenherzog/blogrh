BlogModule.controller('rouvenherzog.Blog.indexController', [
	'$scope',
	'$location',
	'rouvenherzog.Blog.BlogService',
	function( $scope, $location, BlogService ) {
		$scope.entries = BlogService.getEntries();

		$scope.create = function() {
			BlogService
				.createEntry()
				.then(function( entry ) {
					$location.path('/admin/blog/' + entry._id );
				});
		};
	}
]);