TagModule.filter('rouvenherzog.Tag.name', [
	'rouvenherzog.Tag.TagService',
	function( TagService ) {
		return function(id) {
			var tag = TagService.get(id);
			if( tag )
				return tag.name;
			else
				return "Fetching";
		}
	}
])