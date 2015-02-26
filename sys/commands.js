var prompt = require('prompt');
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.database);
var User = require('../modules/users/models').User;
var Account = require('../modules/users/models').Account;
var Tag = require('../modules/tags/models').Tag;
var sha512 = require('crypto').createHash('sha512');
var http = require('http');
var querystring = require('querystring');
var cache = require('node-cache');

var _Error = function( error ) {
	console.log(error);
	process.exit(1);
}

var CreateUser = function() {
	var cuser = function(result, account) {
		delete result['accountid'],
		result.account = account._id;
		result.password = sha512.update(result.password, 'utf8').digest('hex');

		User
			.find()
			.or([{username: result.username}, {email: result.email}])
			.exec(function (error, existing) {
				if( error ) _Error(error);
				if( existing.length > 0 ) _Error("Username or email already exists.");

				var user = new User(result);
				user.save(function(error) {
					if( error ) _Error(error);

					console.log("User " + user.name + " created.");
					process.exit(0);
			});
		});
	};

	prompt.start();
	prompt.get(['name', 'username', 'email', 'password', 'accountid'], function( err, result ) {
		if( result.accountid == '' )
			prompt.get(['accountname'], function( err, accountresult ) {
				var account = new Account({
					name: accountresult.accountname
				});
				account.save(function( error ) {
					if( error ) _Error(error);

					console.log("Created Account " + account.name);
					cuser(result, account);
				});
			})
		else
			Account
				.findById(result.accountid)
				.exec(function(error, account) {
					if( error ) _Error(error);

					if( account == null ) {
						console.log("Account not found.");
						return;
					}

					cuser(result, account);
				});
	});
};

var ListUser = function() {
	User
		.find()
		.exec(function(error, result) {
			if( error ) _Error(error);

			console.log(result.length, "User found.");
			result.forEach(function(item) {
				console.log(item.id, item.name, item.account);
			});

			process.exit(0);
		});
};

var ListAccounts = function() {
	Account
		.find()
		.exec(function(error, result) {
			if( error ) _Error(error);

			console.log(result.length, "Accounts found.");
			result.forEach(function(item) {
				console.log(item.id, item.name);
			});

			process.exit(0);
		});
};

var WhipeData = function() {
	User
		.find()
		.exec(function(error, result) {
			if( error ) _Error(error);

			result.forEach(function(item) {
				item.remove();
			});

			process.exit(0);
		});
	Account
		.find()
		.exec(function(error, result) {
			if( error ) _Error(error);

			result.forEach(function(item) {
				item.remove();
			});

			process.exit(0);
		});
};

var CreateTag = function() {
	prompt.start();
	prompt.get(['name'], function( err, result ) {
		(new Tag({name: result.name})).save(function(error) {
			if( error )
				throw(error);

			process.exit(0);
		});
	});
};

var CachePiwik = function() {
	var query = querystring.stringify({
		module: 'API',
		method: 'API.get',

		idSite: 1,
		period: 'range',
		date: 'last14',
		format: 'json',
		token_auth: '5a78aad39d2846a3d58845c5514a375d'
	});

	http.get(
		'http://piwik.rouvenherzog.me/?' + query,
		function(res) {
			console.log( 'http://piwik.rouvenherzog.me/?' + query );
			console.log( res.statusCode );
			res.on('data', function(data) {
				console.log("========================================");
				console.log(JSON.parse(data.toString()));
				console.log("========================================");
			});

			res.on('end', function() {
				process.exit(0);
			});
		}
	)

	.on('error', function(error) {
		console.log(error);
		process.exit(-1);
	});
};

var command = process.argv[2];
switch( command ) {
	case 'createUser':
		CreateUser();
		break;
	case 'listUser':
		ListUser();
		break;
	case 'listAccounts':
		ListAccounts();
		break;
	case 'whipeData':
		WhipeData();
		break;
	case 'createTag':
		CreateTag();
		break;
	case 'cachePiwik':
		CachePiwik();
		break;
	default:
		break;
}