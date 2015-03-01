MediaModule.service('rouvenherzog.Media.MediaService', [
	'$rootScope',
	'$q',
	'$http',
	'rouvenherzog.Media.MediaFactory',
	'rouvenherzog.Notification.NotificationService',
	function( $rootScope, $q, $http, MediaFactory, NotificationService) {
		var media = [];
		var media_cache = {};

		this.get = function() {
			$http
				.get('/admin/api/media')
				.success(function( data ) {
					for( var index in data ) {
						var m = MediaFactory.construct(data[index]);
						media.push(m);
						media_cache[m._id] = m;
					}
				})
				.error(function() {
					NotificationService.error('Errors.500');
				});

			return media;
		};

		this.upload = function( media, path, array ) {
			var a = $q.defer();

			var toFormData = function( m ) {
				var data = new FormData();
				data.append('file', m.file);
				data.append('title', m.title || '');
				data.append('tags', m.tags);
				data.append('description', m.description);

				return data;
			};

			var index = 0;
			var upl = function() {
				if( index >= media.length ) {
					a.resolve();
					return;
				}

				media[index].uploading = true;
				media[index].failed = false;

				$http
					.post(
						path,
						toFormData(media[index]), {
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						}
					)
					.success(function( data ) {
						var m = MediaFactory.construct(data);

						if( array )
							array.push(m);

						media[index].uploading = false;
						media[index].uploaded = true;

						a.notify({
							current: index+1
						});

						index++;

						// Recursively upload all files
						upl();
					})
					.error(function() {
						var failedat = index;
						for( ; index < media.length; index++ ) {
							media[index].uploading = false;
							media[index].failed = true;
						}

						a.reject( failedat );
					});
			};

			// Start uploading files
			upl();

			return a.promise;
		};
	}
]);