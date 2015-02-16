TagModule.service('rouvenherzog.Tag.TagService', [
	function() {
		var tags = [{
			_id: 1,
			name: 'A'
		},{
			_id: 2,
			name: 'B'
		},{
			_id: 3,
			name: 'C'
		}];

		this.get = function() {
			return tags;
		};
	}
]);