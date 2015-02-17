MediaModule.service('rouvenherzog.Media.MediaService', [
	'$q',
	'$http',
	'rouvenherzog.Media.MediaFactory',
	function( $q, $http, MediaFactory ) {
		this.upload = function( media, path, array ) {
			var a = $q.defer();

			var index = 0;
			var upl = function() {
				if( index >= media.length ) {
					a.resolve();
					return;
				}

				$http
					.post(
						path,
						media[index].toFormData(), {
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						}
					)
					.success(function( data ) {
						media[index].set(data);
						media[index].setPersisted(true);

						if( array )
							array.push(media[index]);

						index++;
						upl();
					});
			};

			upl();

			return a.promise;
		};
	}
]);