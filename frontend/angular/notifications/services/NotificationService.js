NotificationModule.service('rouvenherzog.Notification.NotificationService', [
	'rouvenherzog.Notification.NotificationFactory',
	'$timeout',
	function( NotificationFactory, $timeout ) {
		var notifications = [];
		var self = this;

		var create_notification = function( type, text, timeout ) {
			var notification = NotificationFactory[type](text);
			notifications.push(notification);

			if( timeout )
				$timeout(function() {
					self.closeNotification( notification );
				}, timeout);

			return notification;
		};

		this.getNotifications = function() {
			return notifications;
		};

		this.error = function( text, timeout ) {
			return create_notification( 'error', text, timeout );
		};

		this.success = function( text, timeout ) {
			return create_notification( 'success', text, timeout );
		}

		this.default = function( text, timeout ) {
			return create_notification( 'default', text, timeout );
		};

		this.closeNotification = function( notification ) {
			var index = notifications.indexOf(notification)
			if( index != -1 )
				notifications.splice(index, 1);
		};
	}
]);