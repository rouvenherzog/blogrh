BlogModule.controller('rouvenherzog.Blog.editController', [
	'$scope',
	'$routeParams',
	'$location',
	'rouvenherzog.Blog.BlogService',
	'rouvenherzog.Notification.ConfirmationService',
	function( $scope, $routeParams, $location, BlogService, ConfirmationService ) {
		$scope.entry = undefined;

		BlogService
			.getEntry( $routeParams.id )
			.then(function( entry ) {
				$scope.entry = entry;
			});

		$scope.save = function() {
			$scope.entry
				.save();
		};

		$scope.publish = function() {
			$scope.entry
				.publish();
		};

		$scope.delete = function($event) {
			$event.stopPropagation();

			ConfirmationService.confirm(
				$event.target, {
					placement: 'top',
					title: 'Blog.deleteConfirmation.title',
					confirmText: 'Blog.deleteConfirmation.okay',
					cancelText: 'Blog.deleteConfirmation.cancel'
				}
			).then(function() {
				BlogService
					.deleteEntry($scope.entry)
					.then(function() {
						$scope.back();
					});
			});
		};

		$scope.back = function() {
			if( $scope.entry )
				$scope.reset();

			$location.path('/admin/blog');
		};
	}
]);