NotificationModule.service('rouvenherzog.Notification.NotificationService', [
	'rouvenherzog.Notification.NotificationFactory',
	'$timeout',
	'$q',
	'$translate',
	function( NotificationFactory, $timeout, $q, $translate ) {
		var notifications = [];
		var self = this;

		var create_notification = function( type, text, timeout ) {
			var a = $q.defer();
			$translate(text).then(function(translation) {
				var notification = NotificationFactory[type](translation);
				notifications.push(notification);

				if( timeout )
					$timeout(function() {
						self.closeNotification( notification );
					}, timeout);

				a.resolve(notification);
			});

			return a.promise;
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