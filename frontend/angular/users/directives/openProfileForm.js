UserModule.directive('rouvenherzogOpenProfileForm', [
	'$compile',
	function( $compile ) {
		return {
			restrict: 'A',
			link: function( $scope, $element ) {
				var template = "<rouvenherzog-profile-form></rouvenherzog-profile-form>";

				$element.on('click', function() {
					angular.element(document.body).append($compile(template)($scope));
				});
			}
		}
	}
])