TagModule.service('rouvenherzog.Tag.TagService', [
	'$http',
	function( $http ) {
		var tags = [];
		var tag_cache = {};

		$http
			.get('/admin/api/tags')
			.success(function(data) {
				for( var index in data ) {
					var t = data[index];
					tags.push(t);
					tag_cache[t._id] = t;
				}
			});

		this.get = function( id ) {
			if( id )
				return tag_cache[id];
			else
				return tags;
		};
	}
]);