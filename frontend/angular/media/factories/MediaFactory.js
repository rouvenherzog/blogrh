MediaModule.factory('rouvenherzog.Media.MediaFactory', [
	'$rootScope',
	'$http',
	'$q',
	function( $rootScope, $http, $q ) {
		var Media = function( args ) {
			// Specify fields for this model
			this.fields = {
				path: null,
				tags: [],
				title: null
			};

			// Clean Copy
			this.clean = {};

			// Initialize all fields
			this.set(this.fields);
			// Populate with arguments
			this.set(args);
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
					a.resolve();
				});

			return a.promise;
		};

		Media.prototype.delete = function( root ) {
			var a = $q.defer();

			$http
				.delete((root || '/admin/api/media/') + this._id )
				.success(function() {
					a.resolve();
				});

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