UserModule.directive('rouvenherzogProfileForm', [
	'$window',
	'$translate',
	'rouvenherzog.User.UserService',
	function( $window, $translate, UserService ) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: '/angular/users/tmpls/edit-profile-modal.tmpl',
			link: function( $scope, $element ) {
				$scope.errors = {};
				$scope.user = UserService.get();
				$scope.locales = {
					'en': '',
					'de': ''
				};

				$translate([
					'User.locales.en',
					'User.locales.de',
				]).then(function( translations ) {
					$scope.locales['en'] = translations['User.locales.en'];
					$scope.locales['de'] = translations['User.locales.de'];
				})

				$scope.close = function() {
					UserService.clear();
					$element.remove();
				};

				$scope.save = function() {
					if( $scope.errors.failed )
						return;

					var locale = UserService.getLocale();
					UserService
						.save()
						.then(function(data) {
							if( data.locale != locale )
								$window.location.reload();
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