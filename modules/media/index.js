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
			name: 'Media',
			root: '/admin/media'
		})

	return app;
};

module.exports.Media = models.Media;