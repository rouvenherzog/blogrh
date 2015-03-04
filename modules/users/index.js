var routes = require('./routes');
var api = require('./api');

module.exports.register = function( app ) {
	routes(app);
	api(app);
};