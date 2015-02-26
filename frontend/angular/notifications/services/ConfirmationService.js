NotificationModule.service('rouvenherzog.Notification.ConfirmationService', [
	'$q',
	'$compile',
	'$rootScope',
	function( $q, $compile, $rootScope ) {
		var a = null;
		var element = null;

		var clear = function( resolve ) {
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
				self.no();
			}
		);

		this.yes = function() {
			clear(true);
		};

		this.no = function() {
			clear(false);
		};

		this.confirm = function(el, options) {
			clear();

			a = $q.defer();

			var scope = $rootScope.$new();
			scope.confirmText = options.confirmText;
			scope.cancelText = options.cancelText;
			scope.title = options.title;
			scope.element = angular.element(el);

			template = $compile('<rouvenherzog-confirmation-popup title="title" confirm-text="confirmText" cancel-text="cancelText" element="element" />')(scope);
			element = angular.element(el);

			return a.promise;
		};
	}
]);