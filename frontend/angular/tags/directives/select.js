TagModule.directive('rouvenherzogTagSelect', [
	'rouvenherzog.Tag.TagService',
	function( TagService ) {
		return {
			restrict: 'E',
			templateUrl: '/angular/tags/tmpls/select.tmpl',
			scope: {
				model: "=model",
				field: "@field"
			},
			link: function( $scope ) {
				$scope.tags = TagService.get();
			}
		}
	}
]);