(function() {
	MediaModule.controller('uploadController', [
		'$scope',
		'$element',
		'rouvenherzog.Tag.TagService',
		'rouvenherzog.Media.MediaFactory',
		'rouvenherzog.Media.MediaService',
		function($scope, $element, TagService, MediaFactory, MediaService) {
			var media = [];
			var tags = TagService.get();

			var amount_files = Math.min(6, $scope.files.length);
			for( var index = 0; index < amount_files; index++ ) {
				var file = $scope.files.item(index);
				var m = MediaFactory.fromFile( file, $scope );
				media.push(m);
			}

			$scope.media = media;
			$scope.tags = tags;
			$scope.selected_media = $scope.media[0];

			$scope.close = function() {
				$scope.$destroy();
				$element.remove();
			};

			$scope.select = function( media ) {
				$scope.selected_media = media;
			};

			$scope.upload = function() {
				MediaService
					.upload($scope.media, $scope.uploadPath, $scope.mediaArray)
					.then(
						// Successfully uploaded all files
						function() {
							$scope.close();
						}
					);
			};
		}
	]);
})();