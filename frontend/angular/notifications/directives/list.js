NotificationModule.directive( 'rouvenherzogNotificationList', [
	'rouvenherzog.Notification.NotificationService',
	function( NotificationService ) {
		return {
			restrict: 'E',
			scope: {},
			templateUrl: '/angular/notifications/tmpls/list.tmpl',
			link: function( $scope ) {
				$scope.notifications = NotificationService.getNotifications();

				$scope.close = function( notification ) {
					NotificationService.closeNotification(notification);
				};
			}
		}
	}
]);