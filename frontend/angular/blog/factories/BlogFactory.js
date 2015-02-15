BlogModule.factory('rouvenherzog.Blog.BlogFactory', [
	'$q',
	'$http',
	'$sce',
	'rouvenherzog.Notification.NotificationService',
	function( $q, $http, $sce, NotificationService ) {
		var Entry = function( args ) {
			// Specify fields for this model
			this.fields = {
				title: "",
				delta: [],
				rendered: "",
				modified_at: new Date(),
				published: false,
				published_at: new Date(),
				summery: "",
				keywords: [],
				media: []
			};

			// Initialize all fields
			this.set(this.fields);
			// Populate with arguments
			this.set(args);
		};

		Entry.prototype.save = function() {
			var a = $q.defer();
			var self = this;

			$http
				.put(
					'/admin/api/blog/' + this._id,
					this.toJSON()
				)
				.success(function(data) {
					self.set(data);
					NotificationService.success('Saved Entry.', 2000);
					a.resolve();
				});

			return a.promise;
		};

		Entry.prototype.delete = function() {
			var a = $q.defer();

			$http
				.delete('/admin/api/blog/' + this._id)
				.success(function() {
					a.resolve();
				});

			return a.promise;
		};

		Entry.prototype.toJSON = function() {
			var result = {};
			for( var key in this.fields ) {
				result[key] = this[key];
			}

			return result;
		};

		Entry.prototype.validate = function( key, value ) {
			// If the rendered field gets set, trust it
			if( key == 'rendered' ) {
				value = $sce.trustAsHtml(value);
			}

			return value;
		};

		Entry.prototype.publish = function() {
			var a = $q.defer();
			var self = this;

			$http
				.put('/admin/api/blog/' + this._id + '/publish')
				.success(function( data ) {
					self.set({
						published: data.published
					});

					a.resolve();
				});

			return a.promise;
		};

		Entry.prototype.set = function( args ) {
			for( var key in args ) {
				this[key] = this.validate(key, args[key]);
			}
		};

		return {
			construct: function(args) {
				return new Entry(args);
			}
		};
	}
]);