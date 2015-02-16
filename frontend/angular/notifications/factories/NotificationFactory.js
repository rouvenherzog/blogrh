NotificationModule.factory('rouvenherzog.Notification.NotificationFactory', [
	function() {
		var classes = {
			'error': 'alert-danger',
			'success': 'alert-success',
			'default': 'alert-info',
		};
		var icons = {
			'error': 'fa fa-exclamation',
			'success': 'fa fa-check',
			'default': 'fa fa-info'
		};

		var Notification = function( type, text ) {
			this.type = type;
			this.text = text;
			this.icon = icons[type];
			this.class = classes[type];
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