TagModule.directive('rouvenherzogTagSelect', [
	'rouvenherzog.Tag.TagService',
	function( TagService ) {
		return {
			restrict: 'E',
			templateUrl: '/angular/tags/tmpls/select.tmpl',
			scope: {
				model: "=",
				field: "@",
				single: "@",
				placeholder: "@"
			},
			link: function( $scope ) {
				$scope.tags = TagService.get();
				$scope.single = $scope.single == "true" ? true : false;
			}
		}
	}
]);