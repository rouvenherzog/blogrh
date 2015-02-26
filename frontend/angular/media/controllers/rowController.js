MediaModule.controller('rouvenherzog.Media.rowController', [
	'$scope',
	'$element',
	'$compile',
	'$filter',
	'$rootScope',
	'rouvenherzog.Tag.TagService',
	'rouvenherzog.Notification.ConfirmationService',
	function( $scope, $element, $compile, $filter, $rootScope, TagService, ConfirmationService ) {
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

		$scope.delete = function($event, media, title, confirmText, cancelText) {
			$event.stopPropagation();

			ConfirmationService.confirm(
				angular.element($event.target).parents('.thumbnail').first(), {
					placement: 'bottom',
					title: title,
					confirmText: confirmText,
					cancelText: cancelText
				}
			).then(function() {
				media
					.delete()
					.then(function() {
						var index = $scope.media.indexOf( media );
						if( index != -1 )
							$scope.media.splice(index, 1);
					});
			});
		};

		$scope.getName = function( tagid ) {
			var tag = TagService.get(tagid);
			return tag ? tag.name : null;
		}
	}
]);