(function() {
	MediaModule.controller('uploadController', [
		'$scope',
		'$element',
		'rouvenherzog.Tag.TagService',
		'rouvenherzog.Media.MediaFactory',
		'rouvenherzog.Media.MediaService',
		function($scope, $element, TagService, MediaFactory, MediaService) {
			var media = [];
			var failed_at = 0;

			var load_preview = function( m ) {
				var reader = new FileReader();

				reader.onload = function( e ) {
					$scope.$apply(function() {
						m.preview = e.target.result;
					});
				};

				reader.readAsDataURL(m.file);
			};

			var amount_files = Math.min(6, $scope.files.length);
			for( var index = 0; index < amount_files; index++ ) {
				var file = $scope.files.item(index);
				var m = {
					file: file,
					name: file.name,
					size: file.size,
					type: file.type,

					preview: null,

					uploading: false,
					uplaoded: false,

					title: undefined,
					tags: []
				};

				load_preview(m);
				media.push(m);
			}

			$scope.failed = false;
			$scope.uploading = false;
			$scope.amount_uploaded = 0;

			$scope.media = media;
			$scope.tags = TagService.get();
			$scope.selected_media = $scope.media[0];

			$scope.close = function() {
				$scope.$destroy();
				$element.remove();
			};

			$scope.select = function( media ) {
				if( $scope.uploading )
					return;

				$scope.selected_media = media;
			};

			$scope.upload = function() {
				var toUpload = $scope.media;
				if( $scope.failed ) {
					toUpload = toUpload.slice(failed_at);
				}

				$scope.failed = false;
				$scope.uploading = true;
				$scope.selected_media = null;

				MediaService
					.upload(toUpload, $scope.uploadPath, $scope.mediaArray)
					.then(
						// Successfully uploaded all files
						function() {
							$scope.close();
						},

						// Something went wront during uploading
						function( index ) {
							$scope.failed = true;
							failed_at += index;
						},

						function( info ) {
							$scope.amount_uploaded = info.current;
						}
					);
			};
		}
	]);
})();