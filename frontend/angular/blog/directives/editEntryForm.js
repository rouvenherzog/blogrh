BlogModule.directive('rouvenherzogBlogEditEntryForm', [
	function() {
		return {
			restrict: 'E',
			scope: {
				entry: "="
			},
			templateUrl: '/angular/blog/tmpls/edit-form.tmpl'
		}
	}
]);