NotificationModule.service('rouvenherzog.Notification.ConfirmationService', [
	'$q',
	'$compile',
	'$rootScope',
	'$translate',
	function( $q, $compile, $rootScope, $translate ) {
		var a = null;
		var element = null;
		var explicit = false;

		var clear = function( resolve, implicit ) {
			if( explicit && implicit )
				return;

			if( a != null )
				if( resolve )
					a.resolve();
				else
					a.reject();
			if( element != null )
				element.popover('destroy');

			a = null;
			element = null;
		};

		var self = this;
		document.getElementsByTagName('body').item(0).addEventListener(
			'click',
			function(){
				self.no( true );
			}
		);

		this.yes = function() {
			clear(true);
		};

		this.no = function( implicit ) {
			clear(false, implicit );
		};

		this.confirm = function(el, options) {
			if( options.explicitClose )
				explicit = true;

			clear();

			a = $q.defer();

			$translate([
				options.confirmText,
				options.cancelText,
				options.title
			]).then(function( translations ) {
				var scope = $rootScope.$new();
				scope.confirmText = translations[options.confirmText];
				scope.cancelText = translations[options.cancelText];
				scope.title = translations[options.title];
				scope.element = angular.element(el);
				scope.placement = options.placement;

				template = $compile('<rouvenherzog-confirmation-popup placement="placement" title="title" confirm-text="confirmText" cancel-text="cancelText" element="element" />')(scope);
				element = angular.element(el);
			});

			return a.promise;
		};
	}
]);