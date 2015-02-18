var api = require('./api');

module.exports = function( app ) {
	api(app);

	return app;
};