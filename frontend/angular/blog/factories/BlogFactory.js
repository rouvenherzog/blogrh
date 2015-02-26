BlogModule.factory('rouvenherzog.Blog.BlogFactory', [
	'$q',
	'$http',
	'$sce',
	'rouvenherzog.Media.MediaFactory',
	'rouvenherzog.Notification.NotificationService',
	function( $q, $http, $sce, MediaFactory, NotificationService ) {
		var Entry = function( args ) {
			// Specify fields for this model
			this.fields = {
				title: "",
				rendered: "",
				modified_at: new Date(),
				published: false,
				published_at: new Date(),
				specifiedSummary: false,
				body: {
					delta: []
				},
				summary: {
					delta: []
				},
				keywords: [],
				media: [],
			};

			// Clean Copy
			this.clean = {};

			// Initialize all fields
			this.set(this.fields);
			// Populate with arguments
			this.set(args);

			// Populate Media
			this.replaceMedia();
		};

		Entry.prototype.getCount = function( stopAt ) {
			var count = 0;
			for( var index in this.body.delta ) {
				count += this.body.delta[index].insert.length;
				if( stopAt && (count >= stopAt) ) {
					return count;
				}
			}

			return count;
		};

		Entry.prototype.hasSummary = function() {
			return this.getCount(700) >= 700;
		};

		Entry.prototype.replaceMedia = function() {
			for( var index in this.media )
				this.media[index] = MediaFactory.construct(this.media[index]);
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
			if( ['body', 'summary'].indexOf(key) != -1 ) {
				if( typeof value == "object" && typeof value.rendered == "string" )
					value.rendered = $sce.trustAsHtml(value.rendered);
			} else {
				value = angular.copy(value);
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
				if( this[key] && angular.isObject(args[key]) ) {
					for( var index in args[key] ) {
						this.clean[key][index] = args[key][index];
						this[key][index] = args[key][index];
					}
				} else {
					this.clean[key] = this.validate(key, args[key]);
					this[key] = this.validate(key, args[key]);
				}
			}
		};

		return {
			construct: function(args) {
				return new Entry(args);
			}
		};
	}
]);