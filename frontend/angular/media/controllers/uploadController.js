(function() {
	var loadPreview = function( media, fileEntry, $scope ) {
		var reader = new FileReader();
		reader.onload = function( e ) {
			$scope.$apply(function(){
				media.preview = e.target.result;
			});
		};

		reader.onprogress = function( e ) {
			$scope.$apply(function(){
				media.loading_progress = e.loaded/e.total;
			});
		};

		reader.readAsDataURL(fileEntry);
	};

	MediaModule.controller('uploadController', [
		'$scope',
		'$element',
		'rouvenherzog.Tag.TagService',
		function($scope, $element, TagService) {
			var media = [];
			var tags = TagService.get();

			var amount_files = Math.min(6, $scope.files.length);
			for( var index = 0; index < amount_files; index++ ) {
				var file = $scope.files.item(index);
				var m = {
					file: file,
					name: file.name,
					size: file.size,
					type: file.type,

					preview: undefined,
					loading_progress: 0,

					title: undefined,
					tags: []
				};
				loadPreview(m, file, $scope);
				media.push(m);
			}

			$scope.media = media;
			$scope.tags = tags;
			$scope.selected_media = $scope.media[0];

			$scope.close = function() {
				$scope.$destroy();
				$element.remove();
			};

			$scope.select = function( media ) {
				$scope.selected_media = media;
			};

			$scope.upload = function() {
				console.log($scope.media);
			};
		}
	]);
})();