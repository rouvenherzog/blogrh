var routes = require('./routes');

module.exports = function( app ) {
	routes(app);

	app
		.get('backend')
		.modules
		.push({
			name: 'Home',
			root: '/'+ app.get('backend').name + '/'
		})

	return app;
};