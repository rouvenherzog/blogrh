DashboardModule.directive('rouvenherzogDashboardLineGraph', [
	'rouvenherzog.Dashboard.DashboardService',
	function( DashboardService ) {
		return {
			template: '<canvas></canvas>',
			scope: {
				collection: '@'
			},
			link: function( $scope, $element ) {
				var canvas = $element.find('canvas')[0];
				canvas.width = $element.width();
				canvas.height = "200";
				var context = canvas.getContext("2d");
				var config = {
					tooltipTemplate: "<%= value %>"
				};

				DashboardService.on('change', function( event  ) {
					var data = event.lines[$scope.collection].data;
					var chart = new Chart(context).Line({
						labels: event.labels,
						datasets: [{
							fillColor: "rgba(92,184,92,.2)",
							strokeColor: "rgba(92,184,92,1)",
							pointColor: "rgba(92,184,92,1)",
							pointStrokeColor: "#fff",
							pointHighlightFill: "rgba(142,234,142,1)",
							data: data
						}]
					}, config );
				});
			}
		}
	}
]);