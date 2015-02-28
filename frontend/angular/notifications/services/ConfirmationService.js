NotificationModule.service('rouvenherzog.Notification.ConfirmationService', [
	'$q',
	'$compile',
	'$rootScope',
	function( $q, $compile, $rootScope ) {
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

			var scope = $rootScope.$new();
			scope.confirmText = options.confirmText;
			scope.cancelText = options.cancelText;
			scope.title = options.title;
			scope.element = angular.element(el);
			scope.placement = options.placement;

			template = $compile('<rouvenherzog-confirmation-popup placement="placement" title="title" confirm-text="confirmText" cancel-text="cancelText" element="element" />')(scope);
			element = angular.element(el);

			return a.promise;
		};
	}
]);