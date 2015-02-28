DashboardModule.directive('rouvenherzogDashboardPieGraph', [
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
					legendTemplate : (
						'<h5 class="legend-title"> Legend </h5>'+
						'<ul class="<%=name.toLowerCase()%>-legend">'+
							'<% for (var i=0; i<segments.length; i++){%>'+
								'<li>'+
									'<span style="background-color:<%=segments[i].fillColor%>">'+
										'<%if(segments[i].label){%>'+
											'<%=segments[i].label%>'+
										'<%}else{%>'+
											'Untitled' +
										'<%}%>'+
									'</span>'+
								'</li>'+
							'<%}%>'+
						'</ul>'
					),
					animationSteps: 60
				};

				var colors = [
					'#5cb85c',
					'#337ab7',
					'#5bc0de'
				];

				DashboardService.on('change', function( event  ) {
					var data = event.pies[$scope.collection].data;
					for( var index in data )
						data[index].color = colors[index%3];
					var chart = new Chart(context).Pie(data, config);
					$element.append(chart.generateLegend());
				});
			}
		}
	}
]);