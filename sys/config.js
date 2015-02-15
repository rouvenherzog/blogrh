var express = require('express');
var logger = require('morgan')
var bodyParser = require('body-parser');
var multer = require('multer');

module.exports = {
	database: 'mongodb://localhost/abc',
	init: function( app, config ) {
		config = config || {};

		// Set Backend information
		app.set( 'backend', {
			name: config.name || 'admin',
			api: (config.name || 'admin') + '/api',
			modules: []
		});

		var frontend_dir = __dirname + '/../frontend/';
		// Add Template Directory
		app.get('views').push( frontend_dir + 'templates' );
		// Set Assets Directory
		app.use( '/static/' + app.get('backend').name, express.static(frontend_dir + 'static') );

		// Make the app available in Jade
		app.locals.app = app;

		// Add Content Parser
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(multer());

		// Add logger
		app.use(logger('dev'));

		// Add the url to requests
		app.use(function(request, response, next) {
			response.locals.url = request.url;
			next();
		});
	}
};