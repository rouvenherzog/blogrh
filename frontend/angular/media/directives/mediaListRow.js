MediaModule.directive('rouvenherzogMediaListRow', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: '/angular/media/tmpls/media-list-row.tmpl',
			scope: {
				media: "=",
				tag: "="
			}
		}
	}
])