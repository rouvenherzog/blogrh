DashboardModule.service('rouvenherzog.Dashboard.DashboardService', [
	'$filter',
	'$http',
	function( $filter, $http ) {
		var data = {
			labels: [],
			lines: {
				visitors: {
					field: 'nb_uniq_visitors',
					data: []
				},
				visits: {
					field: 'nb_visits',
					data: []
				},
				pageviews: {
					field: 'nb_pageviews',
					data: []
				},
				bounce: {
					field: 'bounce_rate',
					data: []
				},
				actions: {
					field: 'nb_actions_per_visit',
					data: []
				},
				timeOnSite: {
					field: 'avg_time_on_site',
					data: []
				}
			},
			pies: {
				devices: {
					data: []
				}
			}
		};

		var callbacks = {
			'change': []
		};

		var prepare_data = function( result ) {
			var api_info = result[0];
			for( var key in api_info ) {
				data.labels.push(key);
				var info = api_info[key];
				if( angular.isArray(info) ) {
					for( var i in data.lines )
						data.lines[i].data.push(0);
				} else {
					for( var i in data.lines ) {
						var collection = data.lines[i];
						collection.data.push( parseFloat(info[collection.field]) );
					}
				}
			}

			var device_info = result[1];
			for( var index in device_info ) {
				if( device_info[index].nb_visits > 0 )
					data.pies.devices.data.push({
						value: device_info[index].nb_visits,
						color: '#F00',
						label: device_info[index].label
					});
			}
		};

		var dispatch = function( event, data ) {
			for( var index in callbacks[event] )
				callbacks[event][index](data);
		};

		$http
			.get('/admin/api/dashboard')
			.success(function(result) {
				prepare_data( result );
				dispatch('change', data);
			});

		this.on = function( kind, callback ) {
			callbacks[kind].push(callback);
		};
	}
]);