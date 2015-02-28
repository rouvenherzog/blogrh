BlogModule.directive('rouvenherzogBlogEditEntryForm', [
	'$compile',
	'$interval',
	'rouvenherzog.Notification.ConfirmationService',
	function( $compile, $interval, ConfirmationService ) {
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

				if( $scope.entry.temp ) {
					ConfirmationService.confirm($element.find('.title'), {
						title: 'Blog.RecoverPopup.Title',
						confirmText: 'Blog.RecoverPopup.Recover',
						cancelText: 'Blog.RecoverPopup.Discard',
						explicitClose: true
					}).then(function() {
						$scope.entry.recover();
					});
				}

				$interval(function() {
					$scope.entry.autoSave();
				}, 1000);
			}
		}
	}
]);