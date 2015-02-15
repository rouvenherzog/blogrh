NotificationModule.factory('rouvenherzog.Notification.NotificationFactory', [
	function() {
		icons = {
			'error': 'fa fa-exclamationmark',
			'success': 'fa fa-check',
			'default': 'fa fa-info'
		};

		var Notification = function( type, text ) {
			this.type = type;
			this.text = text;
			this.icon = icons[type];
		};

		Notification.setText = function( text ) {
			this.text = text;
		};

		return {
			error: function( text ) {
				return new Notification( 'error', text );
			},
			success: function( text ) {
				return new Notification( 'success', text );
			},
			default: function( text ) {
				return new Notification( 'default', text );
			}
		}
	}
]);