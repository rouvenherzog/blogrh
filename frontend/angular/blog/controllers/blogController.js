BlogModule.controller('rouvenherzog.Blog.blogController', [
	'$scope',
	'$location',
	'$routeParams',
	'$sce',
	'rouvenherzog.Blog.BlogService',
	'rouvenherzog.Notification.ConfirmationService',
	function( $scope, $location, $routeParams, $sce, BlogService, ConfirmationService ) {
		var templates = {
			'single': '/angular/blog/tmpls/edit.tmpl',
			'list': '/angular/blog/tmpls/index.tmpl',
			'combined': '/angular/blog/tmpls/combined.tmpl'
		};

		$scope.template = null;
		var determineTemplate = function() {
			if( window.innerWidth < 768 ) {
				if( $routeParams.id ) {
					$scope.template = templates['single'];
				} else {
					$scope.template = templates['list'];
				}
			} else {
				$scope.template = templates['combined'];
			}
		};

		determineTemplate();

		window.addEventListener('resize', function() {
			$scope.$apply(function() {
				determineTemplate();
			});
		});

		$scope.entry = null;
		$scope.entries = BlogService.getEntries();
		$scope.not_found = false;

		if( $routeParams.id ) {
			BlogService
				.getEntry( $routeParams.id )
				.then(
					function( entry ) {
						$scope.entry = entry;
					},
					function() {
						$scope.not_found = true;
					}
				);
		}

		$scope.open = function( entry ) {
			$scope.entry = entry;
			$location.path("/admin/blog/" + (entry ? entry._id : ''));
		};

		$scope.save = function() {
			$scope.entry.save();
		};

		$scope.publish = function() {
			$scope.entry.publish();
		};

		$scope.delete = function($event) {
			$event.stopPropagation();
			ConfirmationService.confirm(
				$event.target, {
					placement: 'bottom',
					title: 'Blog.deleteConfirmation.title',
					confirmText: 'Blog.deleteConfirmation.okay',
					cancelText: 'Blog.deleteConfirmation.cancel'
				}
			).then(function() {
				BlogService
					.deleteEntry($scope.entry)
					.then(function() {
						$scope.open(null);
					});
			});
		};

		$scope.create = function() {
			BlogService
				.createEntry()
				.then(function( entry ) {
					$location.path('/admin/blog/' + entry._id );
				});
		};

		$scope.listSorts = {
			available: [
				{
					field: 'created_at',
					display: $sce.trustAsHtml('<i class="fa fa-clock-o"></i> '),
					direction: true
				},{
					field: 'published',
					display: $sce.trustAsHtml('Status '),
					direction: true
				}
			],

			activate: function( sorting ) {
				if( sorting == $scope.listSorts.active )
					sorting.direction = !sorting.direction;
				else
					$scope.listSorts.active = sorting;
			},

			active: null
		};
		$scope.listSorts.active = $scope.listSorts.available[0];
	}
]);