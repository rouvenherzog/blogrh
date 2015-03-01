MediaModule.directive('rouvenherzogMediaListRow', [
	'$filter',
	function($filter) {
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