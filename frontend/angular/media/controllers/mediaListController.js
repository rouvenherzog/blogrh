MediaModule.controller('mediaListController', [
	'$scope',
	'$compile',
	'rouvenherzog.Media.MediaService',
	'rouvenherzog.Tag.TagService',
	function( $scope, $compile, MediaService, TagService ) {
		$scope.media = MediaService.get();
		$scope.tags = TagService.get();
		$scope.notag = null;

		$scope.filter = {
			tag: null,
			query: null
		};

		$scope.upload_files = function( files ) {
			var scope = $scope.$new(true);
				scope.mediaArray = $scope.media;
				scope.files = files;
				scope.uploadPath = "/admin/api/media";

			var template = $compile('<rouvenherzog-media-upload-modal files="files" upload-path="uploadPath" media-array="mediaArray"></rouvenherzog-media-upload-modal>')(scope);
			angular.element(document.body).append(template);
		};
	}
]);