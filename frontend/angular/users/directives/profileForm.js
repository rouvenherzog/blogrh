UserModule.directive('rouvenherzogProfileForm', [
	'rouvenherzog.User.UserService',
	function( UserService ) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: '/angular/users/tmpls/edit-profile-modal.tmpl',
			link: function( $scope, $element ) {
				$scope.errors = {};
				$scope.user = UserService.get();
				$scope.locales = [
					{short:'en', title:'English'},
					{short: 'de', title:'German'}
				];

				$scope.close = function() {
					UserService.clear();
					$element.remove();
				};

				$scope.save = function() {
					if( $scope.errors.failed )
						return;

					UserService
						.save()
						.then(function(data) {
							$scope.close();
						}, function( errors ) {
							$scope.errors = errors;
						});
				};

				$scope.validate = function() {
					$scope.errors = UserService.validate();
				};
			}
		}
	}
])