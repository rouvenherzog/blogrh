var blogmodule = require('../modules/blog');
var mediamodule = require('../modules/media');
var dashboardmodule = require('../modules/dashboard');
var tagsmodule = require('../modules/tags');
var usersmodule = require('../modules/users');
var config = require('./config');

module.exports.register = function(app, args) {
	config.init( app, args );

	// Init dashboard and users app
	dashboardmodule.register(app);
	usersmodule.register(app);

	app.get(/angular\/(.*)$/, function(request, response, next) {
		var path = request.params[0];
		response.render(path + ".jade");
	});

	blogmodule.register(app);
	mediamodule.register(app);
	tagsmodule.register(app);

	config.error_handling(app);

	return app;
};

module.exports.Entry = blogmodule.Entry;
module.exports.Media = mediamodule.Media;
module.exports.Tag = tagsmodule.Tag;
module.exports.configuration = config.configuration;