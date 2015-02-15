BlogModule.directive('rouvenherzogBlogQuill', [
	function() {
		return {
			restrict: 'E',
			scope: {
				model: "=ngModel",
				field: "@"
			},
			templateUrl: '/angular/blog/tmpls/quill.tmpl',
			link: function( $scope, element, attrs ) {
				// Initialize the editor
				var quill = new Quill(
					element[0].getElementsByClassName('editor').item(0), {
						theme: 'snow'
					});
				quill.addModule('toolbar', { container: element[0].getElementsByClassName('toolbar').item(0) });

				// Initialize quill after model loaded
				var initializer = $scope.$watch('model', function(model) {
					if( model ) {
						// Set editor content
						quill.setContents(model[$scope.field]);

						// Initialize listeners
						quill.on('text-change', function(delta, source) {
							var ops = quill.getContents().ops;
							var last = ops[ops.length-1].insert;
							if( last.match(/^\n$/g) )
								ops = ops.splice(0, ops.length-1);
							else if( last.match(/\n$/g) )
								ops[ops.length-1].insert = last.substr(0, last.length-1 );

							$scope.$apply(function() {
								$scope.model[$scope.field] = ops;
							});
						});

						// Stop waitin for model to load
						initializer();
					}
				});
			}
		}
	}
]);