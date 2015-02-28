BlogModule.directive('rouvenherzogBlogEditEntryForm', [
	'$compile',
	'$interval',
	function( $compile, $interval ) {
		return {
			restrict: 'E',
			scope: {
				entry: "="
			},
			templateUrl: '/angular/blog/tmpls/edit-form.tmpl',
			link: function( $scope, $element ) {
				$scope.saving = false;

				$scope.upload_files = function( files ) {
					var scope = $scope.$new(true);
						scope.mediaArray = $scope.entry.media;
						scope.files = files;
						scope.uploadPath = "/admin/api/blog/" + $scope.entry._id + "/media";

					var template = $compile('<rouvenherzog-media-upload-modal files="files" upload-path="uploadPath" media-array="mediaArray"></rouvenherzog-media-upload-modal>')(scope);
					angular.element(document.body).append(template);
				};

				$scope.modified = function( ops ) {
					$scope.entry.modified();
				};

				$scope.entry.recover($element.find('.title'));

				$interval(function() {
					$scope.entry.autoSave();
				}, 1000);
			}
		}
	}
]);