MediaModule.directive('rouvenherzogMediaInputNotify', [
	function() {
		return {
			restrict: 'A',
			scope: {
				callback: "=rouvenherzogMediaInputNotify"
			},
			link: function( $scope, element ) {
				element.on('change', function(event) {
					$scope.$apply(function() {
						$scope.callback(event.target.files);
					});
				});
			}
		}
	}
]);