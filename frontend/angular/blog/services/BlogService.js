BlogModule.service('rouvenherzog.Blog.BlogService', [
	'$q',
	'$http',
	'rouvenherzog.Blog.BlogFactory',
	'rouvenherzog.Notification.NotificationService',
	function( $q, $http, BlogFactory, NotificationService ) {
		var initial_queried = false;
		var current_page = 0;
		var entries = [];
		var entries_index = {};

		var add = function( entry ) {
			if( !entries_index[entry._id] ) {
				var object = BlogFactory.construct(entry);
				entries_index[object._id] = object;
				entries.push(object);
				return object;
			} else {
				return entries_index[entry._id];
			}
		};

		var queryEntries = function( page ) {
			$http
				.get('/admin/api/blog/', {
					page: page
				})
				.success(function(data) {
					var objects = data;
					for( var index in objects )
						add(objects[index]);
				});
		};

		this.getEntries = function( page ) {
			page = page || 1;
			for( var index = current_page; index < page; index++ )
				queryEntries(page);

			return entries;
		};

		this.getEntry = function( id ) {
			var a = $q.defer();

			if( entries_index[id] )
				a.resolve(entries_index[id]);
			else
				$http
					.get('/admin/api/blog/' + id)
					.success(function(data) {
						var object = add(data);
						a.resolve(object);
					});

			return a.promise;
		};

		this.deleteEntry = function( entry ) {
			var a = $q.defer();

			entry
				.delete()
				.then(function() {
					delete entries_index[entry._id];
					entries.splice(entries.indexOf(entry), 1);
					a.resolve();
				});

			return a.promise;
		};

		this.createEntry = function() {
			var a = $q.defer();
			$http
				.post('/admin/api/blog/')
				.success(function( data ) {
					var entry = add( data );
					NotificationService.success('Blog.Notifications.created', 2000);
					a.resolve( entry );
				});
			return a.promise;
		};
	}
]);