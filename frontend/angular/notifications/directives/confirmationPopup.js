NotificationModule.directive( 'rouvenherzogConfirmationPopup', [
	'rouvenherzog.Notification.ConfirmationService',
	function( ConfirmationService ) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				element: "=",
				confirmText: "=",
				cancelText: "=",
				title: "=",
				placement: "="
			},
			templateUrl: '/angular/notifications/tmpls/confirmation.tmpl',
			link: function( $scope, $element ) {
				$scope.confirm = function() {
					ConfirmationService.yes();
				};

				$scope.cancel = function() {
					ConfirmationService.no();
				};

				$scope.element
					.popover({
						html: true,
						placement: $scope.placement || 'auto',
						title: $scope.title || 'Sure?',
						trigger: 'manual'
					})
					.popover('show');

				$scope.element.siblings('.popover').find('.popover-content')
					.append($element);
			}
		}
	}
]);