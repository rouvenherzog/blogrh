MediaModule.service('rouvenherzog.Media.MediaService', [
	'$rootScope',
	'$q',
	'$http',
	'rouvenherzog.Media.MediaFactory',
	function( $rootScope, $q, $http, MediaFactory) {
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

				return data;
			};

			var index = 0;
			var upl = function() {
				if( index >= media.length ) {
					a.resolve();
					return;
				}

				media[index].uploading = true;

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
						upl();
					});
			};

			// Leave digest cicly for $rootScope.$apply
			upl();

			return a.promise;
		};
	}
]);