var routes = require('./routes');
var api = require('./api');
var models = require('./models');

module.exports.register = function( app ) {
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

module.exports.Entry = models.Entry;