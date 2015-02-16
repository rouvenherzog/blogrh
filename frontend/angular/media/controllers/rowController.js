MediaModule.controller('rouvenherzog.Media.rowController', [
	'$scope',
	'$element',
	'$compile',
	'$rootScope',
	function( $scope, $element, $compile, $rootScope ) {
		$scope.uploadEnabled = (!$scope.disableUpload && $scope.uploadPath) ? true : false;
		$scope.media = $scope.mediaArray || [];

		$scope.upload_files = function( files ) {
			var scope = $rootScope.$new(true);
				scope.mediaArray = scope.media;
				scope.files = files;
				scope.uploadPath = $scope.uploadPath;

			var template = $compile('<rouvenherzog-media-upload files="files" upload-path="uploadPath" media-array="mediaArray"></rouvenherzog-media-upload>')(scope);
			angular.element(document.body).append(template);
		};
	}
]);