var routes = require('./routes');

module.exports = function( app ) {
	routes(app);

	app
		.get('backend')
		.modules
		.push({
			name: 'Home',
			root: '/admin/'
		})

	return app;
};