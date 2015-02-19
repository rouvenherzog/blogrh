var routes = require('./routes');
var api = require('./api');

module.exports = function( app ) {
	routes(app);
	api(app);

	app
		.get('backend')
		.modules
		.push({
			name: 'Blog',
			root: '/admin/blog'
		})

	return app;
};