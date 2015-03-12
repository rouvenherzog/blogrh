BlogModule.directive('rouvenherzogBlogQuill', [
	'$rootScope',
	function( $rootScope ) {
		return {
			restrict: 'E',
			scope: {
				model: "=ngModel",
				field: "@",
				articleLength: "@",
				watch: "=",
				notify: "="
			},
			templateUrl: '/angular/blog/tmpls/quill.tmpl',
			link: function( $scope, element, attrs ) {
				var model;
				var field;

				// drilldown
				var drilldown = function() {
					model = $scope.model;
					var d = $scope.field.split('.');
					for( var i = 0; i < d.length-1; i++ ) {
						model = model[d[i]];
						field = d[i+1];
					}
				}

				// Initialize the editor
				var quill = new Quill(
					element[0].getElementsByClassName('editor').item(0), {
						theme: 'snow'
					});
				quill.addModule('toolbar', { container: element[0].getElementsByClassName('toolbar').item(0) });

				// Initialize quill after model loaded
				var initializer = $scope.$watch('model', function() {
					if( $scope.model ) {
						drilldown();

						// Set editor content
						quill.setContents(model[field]);

						// Initialize listeners
						quill.on('text-change', function(delta, source) {
							var ops = quill.getContents().ops;

							// model[field] = ops;
							model[field].splice(0);
							for( var index in ops )
								model[field][index] = ops[index];

							if( $scope.notify )
								$scope.notify(ops);
							if( !$rootScope.$$phase )
								$scope.$apply();
						});

						// Stop waitin for model to load
						initializer();
					}
				});

				if( $scope.watch ) {
					$scope.$watch('watch', function(n) {
						if( n )
							quill.setContents(n.delta);
					}, true);
				};

				$scope.getAmountCharacters = function() {
					if( !model ) return 0;

					var count = 0;
					for( var index in model[field] )
						count += model[field][index].insert.length;

					return count;
				};
			}
		}
	}
]);