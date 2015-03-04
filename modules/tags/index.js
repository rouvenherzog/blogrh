var api = require('./api');
var models = require('./models');

module.exports.register = function( app ) {
	api(app);

	return app;
};

module.exports.Tag = models.Tag;