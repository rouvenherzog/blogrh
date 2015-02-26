BlogModule.directive('rouvenherzogBlogEditEntryForm', [
	'$compile',
	function( $compile ) {
		return {
			restrict: 'E',
			scope: {
				entry: "="
			},
			templateUrl: '/angular/blog/tmpls/edit-form.tmpl',
			link: function( $scope ) {
				$scope.upload_files = function( files ) {
					var scope = $scope.$new(true);
						scope.mediaArray = $scope.entry.media;
						scope.files = files;
						scope.uploadPath = "/admin/api/blog/" + $scope.entry._id + "/media";

					console.log("upload", files);
					var template = $compile('<rouvenherzog-media-upload-modal files="files" upload-path="uploadPath" media-array="mediaArray"></rouvenherzog-media-upload-modal>')(scope);
					angular.element(document.body).append(template);
				};
			}
		}
	}
]);