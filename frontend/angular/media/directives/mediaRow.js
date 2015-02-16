MediaModule.directive('rouvenherzogMediaRow', [
	function() {
		return {
			restrict: 'E',
			templateUrl: 'angular/media/tmpls/row.tmpl',
			controller: 'rouvenherzog.Media.rowController',
			scope: {
				mediaArray: "=",
				disableUpload: "=",
				uploadPath: "="
			}
		}
	}
]);