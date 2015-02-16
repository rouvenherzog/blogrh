MediaModule.directive('rouvenherzogMediaUpload', [
	function() {
		return {
			restrict: 'E',
			scope: {
				files: "=",
				mediaArray: "=",
				uploadPath: "="
			},
			templateUrl: '/angular/media/tmpls/upload-modal.tmpl',
			controller: 'uploadController'
		};
	}
]);