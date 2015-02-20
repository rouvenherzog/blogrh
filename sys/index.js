var blogmodule = require('../modules/blog');
var mediamodule = require('../modules/media');
var dashboardmodule = require('../modules/dashboard');
var tagsmodule = require('../modules/tags');
var usersmodule = require('../modules/users');
var config = require('./config');
var db = require('./database');

module.exports = function(app, args) {
	config.init( app, args );

	// Init dashboard and users app
	dashboardmodule(app);
	usersmodule(app);

	app.get(/angular\/(.*)$/, function(request, response) {
		var path = request.params[0];
		response.render(path + ".jade");
	});

	if( args ) {
		if( args.blog )
			blogmodule(app);
		if( args.media )
			mediamodule(app);
		if( args.tags )
			tagsmodule(app);
	}

	return app;
};