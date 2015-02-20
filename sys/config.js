var express = require('express');
var logger = require('morgan')
var bodyParser = require('body-parser');
var multer = require('multer');
var i18n = require('i18n');
var authentication = require('./authentication');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = {
	database: 'mongodb://localhost/abc',
	init: function( app, config ) {
		config = config || {};

		// Set Backend information
		app.set( 'backend', {
			api: '/admin/api',
			modules: []
		});

		// Set up i18n
		var locales = ['en', 'de'];
		i18n.configure({
			locals: ['en', 'de'],
			directory: frontend_dir + 'locales',
			defaultLocale: 'de'
		});
		app.use('/admin', i18n.init);
		app.param('lang', function(request, response, next, lang) {
			if( locales.indexOf(lang) == -1 ) {
				// Raise a 404
			}

			i18n.setLocale(request, lang);
			next();
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

		// Make the app available in Jade
		app.locals.app = app;
		app.use(function(req, res, next) {
			res.locals.user = req.user || {};
			next();
		});
	}
};