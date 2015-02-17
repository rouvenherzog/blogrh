MediaModule.controller('rouvenherzog.Media.rowController', [
	'$scope',
	'$element',
	'$compile',
	'$rootScope',
	function( $scope, $element, $compile, $rootScope ) {
		$scope.uploadEnabled = (!$scope.disableUpload && $scope.uploadPath) ? true : false;
		$scope.media = $scope.mediaArray;

		$scope.rowStyle = {
			width: ($scope.media.length*135) + "px"
		};

		$scope.edit = function( media ) {
			var scope = $rootScope.$new(true);
				scope.media = media;

			var template = $compile('<rouvenherzog-media-edit-modal media="media"></rouvenherzog-media-edit-modal>')(scope);
			angular.element(document.body).append(template);
		};

		$scope.delete = function( media ) {
			media
				.delete($scope.deletePath)
				.then(function() {
					if( $scope.media ) {
						var index = $scope.media.indexOf( media );
						if( index != -1 )
							$scope.media.splice(index, 1);
					}
				});
		};
	}
]);