var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var i18n = require('i18n');
var authentication = require('./authentication');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

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
		if( typeof app.get('views') == 'string' )
			app.set('views', [app.get('views')]);
		app.get('views').push( frontend_dir + 'templates' );

		// Set Assets Directory
		app.use( '/static/admin', express.static(frontend_dir + 'static') );

		// Add Content Parser
		app.use(cookieParser(app.get('secrets').cookie));
		app.use(session({
			secret: app.get('secrets').session,
			resave: false,
			cookie: {
				maxAge: 1000 * 60 * 30
			},
			saveUninitialized: true,
			store: new RedisStore({
				client: cache
			})
		}));
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		app.use(multer({
			dest: app.get('uploaddir'),
			inMemory: true
		}));

		// Add logger
		app.use(logger(
			app.get('env') === 'development' ? 'dev' : 'tiny'
		));

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
	},

	error_handling: function( app ) {
		// development error handler
		// will print stacktrace
		var error_handler = null;
		if (app.get('env') === 'development') {
			error_handler = function(err, req, res, next) {
				res.status(500);
				if( req.xhr ) {
					if( req.status == 404 ) {
						res.status(404);
						res.json();
					} else {
						res.json({
							message: err.message,
							stack: err.stack.split('\n')
						})
					}
				} else {
					res.render('errors/development-500', {
						message: err.message,
						error: err
					});
				}
			};
		} else {
			error_handler = function(err, req, res, next) {
				res.status(500);
				if( req.xhr ) {
					if( req.status == 404 ) {
						res.status(404);
						res.json();
					} else {
						res.json({
							message: err.message
						});
					}
				} else {
					res.render('errors/production-500', {
						message: err.message
					});
				}
			}
		}
		app.use( '/admin', error_handler );
		app.use( '/angular', error_handler );

		var handler_404 = function( req, res, next ) {
			res.status(404);
			if( req.xhr ) {
				res.json({});
			} else {
				res.render('errors/404');
			}
		};
		app.use('/admin', handler_404);
		app.use('/angular', handler_404);
	}
};