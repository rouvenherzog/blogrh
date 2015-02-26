BlogModule.controller('rouvenherzog.Blog.combinedController', [
	'$scope',
	'$location',
	'$routeParams',
	'$sce',
	'rouvenherzog.Blog.BlogService',
	'rouvenherzog.Notification.ConfirmationService',
	function( $scope, $location, $routeParams, $sce, BlogService, ConfirmationService ) {
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

		$scope.delete = function($event, title, confirmText, cancelText) {
			$event.stopPropagation();

			ConfirmationService.confirm(
				$event.target, {
					placement: 'bottom',
					title: title,
					confirmText: confirmText,
					cancelText: cancelText
				}
			).then(function() {
				BlogService
					.deleteEntry($scope.selected_entry)
					.then(function() {
						$scope.open(null);
					});
			});
		};

		$scope.create = function() {
			BlogService
				.createEntry()
				.then(function( entry ) {
					$location.path('/admin/blog/' + entry._id );
				});
		};

		$scope.listSorts = {
			available: [
				{
					field: 'created_at',
					display: $sce.trustAsHtml('<i class="fa fa-clock-o"></i> '),
					direction: true
				},{
					field: 'published',
					display: $sce.trustAsHtml('Status '),
					direction: true
				}
			],

			activate: function( sorting ) {
				if( sorting == $scope.listSorts.active )
					sorting.direction = !sorting.direction;
				else
					$scope.listSorts.active = sorting;
			},

			active: null
		};
		$scope.listSorts.active = $scope.listSorts.available[0];
	}
]);