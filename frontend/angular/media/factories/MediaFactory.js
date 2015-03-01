MediaModule.factory('rouvenherzog.Media.MediaFactory', [
	'$rootScope',
	'$http',
	'$q',
	'rouvenherzog.Notification.NotificationService',
	function( $rootScope, $http, $q, NotificationService ) {
		var Media = function( args ) {
			this.listeners = {
				'change': []
			};

			// Specify fields for this model
			this.fields = {
				path: null,
				tags: [],
				title: null,
				description: null
			};

			// Clean Copy
			this.clean = {};

			// Initialize all fields
			this.set(this.fields);
			// Populate with arguments
			this.set(args);
		};

		Media.prototype.on = function( event, callback ) {
			this.listeners[event].push(callback);
		};

		Media.prototype.off = function( event, callback ) {
			var index = this.listeners[event].indexOf(callback);
			if( index != -1 )
				this.listeners[event].splice(index, 1);
		};

		Media.prototype.dispatchEvent = function( event ) {
			for( var index in this.listeners[event] )
				this.listeners[event][index](this);
		};

		Media.prototype.save = function() {
			var a = $q.defer();
			var self = this;

			$http
				.put(
					'/admin/api/media/' + this._id,
					this.toJSON()
				)
				.success(function( data ) {
					self.set(data);
					NotificationService.success('Media.Notifications.saved', 2000);
					a.resolve();
				})
				.error(function() {
					NotificationService.error('Errors.500');
					a.reject();
				})

			return a.promise;
		};

		Media.prototype.delete = function() {
			var a = $q.defer();

			$http
				.delete('/admin/api/media/' + this._id )
				.success(function() {
					NotificationService.success('Media.Notifications.deleted', 2000);
					a.resolve();
				})
				.error(function(){
					NotificationService.error('Errors.500');
					a.reject();
				})

			return a.promise;
		};

		Media.prototype.toJSON = function() {
			var result = {};
			for( var key in this.fields ) {
				result[key] = this[key];
			}
			return result;
		};

		Media.prototype.set = function( args ) {
			for( var key in args ) {
				this.clean[key] = args[key];
				this[key] = args[key];
			}

			this.dispatchEvent('change');
		};

		Media.prototype.clear = function() {
			this.set(this.clean);
		};

		return {
			construct: function( args ) {
				return new Media( args );
			}
		};
	}
]);