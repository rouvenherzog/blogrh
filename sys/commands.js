var prompt = require('prompt');
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.database);
var User = require('backend/modules/users/models').User;
var Account = require('backend/modules/users/models').Account;
var sha512 = require('crypto').createHash('sha512');

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
				.findById(accountid)
				.exec(function(error, account) {
					if( error ) _Error(error);

					if( media == null ) {
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
}

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
	default:
		break;
}