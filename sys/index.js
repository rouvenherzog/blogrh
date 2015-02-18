var blogmodule = require('backend/modules/blog');
var mediamodule = require('backend/modules/media');
var dashboardmodule = require('backend/modules/dashboard');
var tagsmodule = require('backend/modules/tags');
var config = require('./config');
var db = require('./database');

module.exports = function(app, args) {
	config.init( app, args );
	dashboardmodule(app);

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