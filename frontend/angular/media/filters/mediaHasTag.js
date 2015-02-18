MediaModule.filter('mediaHasTag', [
	function() {
		return function( media, tag ) {
			return media.filter(function(m) {
				if( !tag )
					return m.clean.tags.length == 0;

				return m.clean.tags.indexOf(tag._id) != -1;
			})
		}
	}
])