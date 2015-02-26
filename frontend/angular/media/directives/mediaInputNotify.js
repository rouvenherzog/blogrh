MediaModule.directive('rouvenherzogMediaInputNotify', [
	function() {
		return {
			restrict: 'A',
			scope: {
				callback: "=rouvenherzogMediaInputNotify"
			},
			link: function( $scope, element ) {
				element.on('click', function(event) {
					element.val(null);
				});

				element.on('change', function(event) {
					$scope.$apply(function() {
						if( event.target.files.length > 0 )
							$scope.callback(event.target.files);
					});
				});
			}
		}
	}
]);