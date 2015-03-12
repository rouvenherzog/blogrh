BlogModule.factory('rouvenherzog.Blog.BlogFactory', [
	'$q',
	'$http',
	'$sce',
	'rouvenherzog.Media.MediaFactory',
	'rouvenherzog.Notification.NotificationService',
	function( $q, $http, $sce, MediaFactory, NotificationService ) {
		var Entry = function( args ) {
			this.dirty = false;
			this.saved = true;

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
				keywords: "",
				media: [],
			};

			// Clean Copy
			// Used to display server state in list etc
			// this.* is dirty version, used in forms
			this.clean = {};

			// This gets updated only from the server ( recover entry )
			// Angular watches this to update its content.
			// watching the entry itself would throw a max stack size exceeded
			this.copy = {};

			// Initialize all fields
			this.set(this.fields, true);
			// Populate with arguments
			this.set(args, true);

			// Populate Media
			this.replaceMedia();
		};

		Entry.prototype.modified = function() {
			console.log(this);
			this.dirty = false;
			for( var key in this.fields ) {
				if( !angular.equals(this[key], this.clean[key]) ) {
					this.dirty = true;
					this.saved = false;
					return true;
				}
			}
		};

		Entry.prototype.autoSave = function() {
			var a = $q.defer();
			var self = this;

			if( this.dirty && !this.saved ) {
				this.saving = true;
				$http
					.put(
						'/admin/api/blog/' + this._id + '/autosave',
						this.toJSON()
					)
					.success(function(data) {
						self.saving = false;
						self.saved  = true;
						a.resolve();
					});
			} else {
				a.resolve();
			}

			return a.promise;
		};

		Entry.prototype.recover = function( el ) {
			this.set(this.temp);
			this.saved = true;
		};

		Entry.prototype.discardTemp = function() {
			var self = this;
			$http
				.delete('/admin/api/blog/' + this._id + '/autosave')
				.success(function() {
					delete self['temp'];
					delete self.clean['temp'];
				});
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

			this.clean.media = this.media;
		};

		Entry.prototype.save = function( dont_notify ) {
			var a = $q.defer();
			var self = this;

			$http
				.put(
					'/admin/api/blog/' + this._id,
					this.toJSON()
				)
				.success(function(data) {
					// Media does not have to be updated
					delete data['media'];
					self.set(data, true);
					if( !dont_notify )
						NotificationService.success('Blog.Notifications.saved', 2000);
					a.resolve();
				});

			return a.promise;
		};

		Entry.prototype.delete = function() {
			var a = $q.defer();

			$http
				.delete('/admin/api/blog/' + this._id)
				.success(function() {
					NotificationService.success('Blog.Notifications.deleted', 2000);
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
			var deepcopy = function( obj ) {
				if( angular.isObject(obj) ) {
					var result = angular.isArray(obj) ? [] : {};
					for( var index in obj ) {
						result[index] = deepcopy( obj[index] );
					}
					return result;
				} else {
					return obj;
				}
			};

			value = deepcopy(value);

			// If the rendered field gets set, trust it
			if( ['body', 'summary'].indexOf(key) != -1 ) {
				if( typeof value == "object" && typeof value.rendered == "string" )
					value.rendered = $sce.trustAsHtml(value.rendered);
			} else if( key == 'rendered' ) {
				value = $sce.trustAsHtml(value);
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

					var message = self.published ?
						'Blog.Notifications.published' :
						'Blog.Notifications.unpublished';
					NotificationService.success( message, 2000 );

					a.resolve();
				});

			return a.promise;
		};

		Entry.prototype.set = function( args, clean ) {
			for( var key in args ) {
				if( this[key] && angular.isObject(args[key]) ) {
					for( var index in args[key] ) {
						if( clean )
							this.clean[key][index] = this.validate(index, args[key][index]);
						this.copy[key][index] = this.validate(index, args[key][index]);
						this[key][index] = this.validate(index, args[key][index]);
					}
				} else {
					if( clean )
						this.clean[key] = this.validate(key, args[key]);
					this.copy[key] = this.validate(key, args[key]);
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