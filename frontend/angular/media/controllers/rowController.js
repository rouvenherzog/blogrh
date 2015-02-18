MediaModule.controller('rouvenherzog.Media.rowController', [
	'$scope',
	'$element',
	'$compile',
	'$filter',
	'$rootScope',
	'rouvenherzog.Tag.TagService',
	function( $scope, $element, $compile, $filter, $rootScope, TagService ) {
		$scope.filtered = ($scope.tag === undefined) ?
			$scope.media :
			$filter('mediaHasTag')($scope.media, $scope.tag);

		if( $scope.tag !== undefined )
			$scope.$watch('media', function( n ) {
				$scope.filtered = ($scope.tag === undefined) ?
					$scope.media :
					$filter('mediaHasTag')($scope.media, $scope.tag);
			}, true);

		$scope.rowStyle = function() {
			return {
				width: ($scope.filtered.length*205) + "px"
			};
		};

		$scope.edit = function( media ) {
			var scope = $rootScope.$new(true);
				scope.media = media;

			var template = $compile('<rouvenherzog-media-edit-modal media="media"></rouvenherzog-media-edit-modal>')(scope);
			angular.element(document.body).append(template);
		};

		$scope.delete = function( media ) {
			media
				.delete()
				.then(function() {
					var index = $scope.media.indexOf( media );
					if( index != -1 )
						$scope.media.splice(index, 1);
				});
		};

		$scope.getName = function( tagid ) {
			var tag = TagService.get(tagid);
			return tag ? tag.name : null;
		}
	}
]);