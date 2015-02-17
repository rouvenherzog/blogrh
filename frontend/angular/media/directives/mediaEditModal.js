MediaModule.directive('rouvenherzogMediaEditModal', [
	function() {
		return {
			restrict: 'E',
			scope: {
				media: "="
			},
			templateUrl: '/angular/media/tmpls/edit-modal.tmpl',
			link: function( $scope, $element ) {
				$scope.close = function() {
					$scope.media.clear();
					$scope.$destroy();
					$element.remove();
				};

				$scope.save = function() {
					$scope.media
						.save()
						.then(function() {
							$scope.close()
						});
				}
			}
		};
	}
]);