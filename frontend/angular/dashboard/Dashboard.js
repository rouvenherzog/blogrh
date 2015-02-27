var DashboardModule = angular.module(
	'rouvenherzog.Dashboard',
	[]
);

DashboardModule.config([function() {
	Chart.defaults.global.responsive = false;
}]);