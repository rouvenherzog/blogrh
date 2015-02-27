var express = require('express');
var logger = require('morgan')
var bodyParser = require('body-parser');
var multer = require('multer');
var i18n = require('i18n');
var authentication = require('./authentication');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Create Cache
var redis = require('redis');
var cache = redis.createClient('6379', 'localhost');

module.exports = {
	database: 'mongodb://localhost/abc',
	cache: cache,
	init: function( app, config ) {
		config = config || {};

		// Set Backend information
		app.set( 'backend', {
			api: '/admin/api',
			modules: []
		});

		var frontend_dir = __dirname + '/../frontend/';
		// Add Template Directory
		app.get('views').push( frontend_dir + 'templates' );
		// Set Assets Directory
		app.use( '/static/admin', express.static(frontend_dir + 'static') );

		// Add Content Parser
		app.use(cookieParser("asd"));
		app.use(session({
			secret: 'theworldisyours',
			resave: false,
			saveUninitialized: true
		}));
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(multer({
			dest: app.get('uploaddir'),
			inMemory: true
		}));

		// Add logger
		app.use(logger('dev'));

		// Add the url to requests
		app.use(function(request, response, next) {
			response.locals.url = request.url;
			next();
		});

		app.use(flash());

		// authenticate
		authentication(app);

		// Set up i18n
		var locales = ['en', 'de'];
		var initI18n = function(request, response, next) {
			i18n.init( request, response );
			if( request.user )
				request.setLocale(request.user.locale);
			next();
		};
		i18n.configure({
			locales: locales,
			directory: frontend_dir + 'locales',
			defaultLocale: 'de',
			objectNotation: true
		});
		app.use('/admin', initI18n);
		app.use('/angular', initI18n);

		// Make the app available in Jade
		app.locals.app = app;
		app.use(function(req, res, next) {
			res.locals.user = req.user || {};
			next();
		});
	}
};