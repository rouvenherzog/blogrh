UserModule.directive('rouvenherzogUserName', [
	'rouvenherzog.User.UserService',
	function( UserService ) {
		return {
			restrict: 'E',
			scope: {},
			replace: false,
			template: '{{ user.name }}',
			link: function( $scope ) {
				$scope.user = UserService.getClean();
			}
		}
	}
])