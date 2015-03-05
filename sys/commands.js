#!/usr/bin/env node

var prompt = require('prompt');
var config = require('./config');
var User = require('../modules/users/models').User;
var Account = require('../modules/users/models').Account;
var Tag = require('../modules/tags/models').Tag;
var sha512 = require('crypto').createHash('sha512');
var http = require('http');
var querystring = require('querystring');
var argv = require('optimist').argv;
var mongoose = require('mongoose');
mongoose.connect(argv.database || "mongodb://localhost/rouvenherzog");

var commands = [];
var RegisterCommand = function( name, args, description ) {
	commands.push({
		name: name,
		args: args,
		description: description
	});
};

var PrintCommands = function() {

	console.log("============ AVAILABLE COMMANDS ============");
	for( var index in commands ) {
		var command = commands[index];
		console.log(
			command.name,
			command.args
		);
		console.log(
			'\t',
			command.description,
			'\n',
			'-----------------------------------------------------------------------'
		);
	}
}

var _Error = function( error ) {
	console.log(error);
	process.exit(1);
}

RegisterCommand('createUser', 'accountid', 'Creates a User for the specified account');
var CreateUser = function( accountid ) {
	if( !accountid )
		return _Error("Specify an account id to create a user for.");

	var cuser = function(result, account) {
		result.account = account._id;
		result.password = sha512.update(result.password, 'utf8').digest('hex');

		User
			.find()
			.or([{username: result.username}, {email: result.email}])
			.exec(function (error, existing) {
				if( error ) return _Error(error);
				if( existing.length > 0 ) return _Error("Username or email already exists.");

				var user = new User(result);
				user.save(function(error) {
					if( error ) _Error(error);

					console.log("User " + user.name + " created.");
					process.exit(0);
			});
		});
	};

	Account
		.findById(accountid)
		.exec(function(error, account) {
			if( error )
				return _Error(error);

			if( account == null )
				return _Error("Account not found.");

			prompt.start();
			prompt.get(['name', 'username', 'email', 'password'], function( err, result ) {
				cuser(result, account);
			});
		});
};

RegisterCommand('listUsers', '[accountid]', 'List all users or users for the specified account.');
var ListUsers = function(accountid) {
	var args = undefined;
	if( accountid )
		args = {account:accountid};

	User
		.find(args)
		.exec(function(error, result) {
			if( error ) _Error(error);

			console.log(result.length, "User found.");
			result.forEach(function(item) {
				console.log(item.id, item.name, item.account);
			});

			process.exit(0);
		});
};

RegisterCommand('createAccount', '', 'Creates a new account.');
var CreateAccount = function() {
	prompt.get(['accountname'], function( err, accountresult ) {
		var account = new Account({
			name: accountresult.accountname
		});
		account.save(function( error ) {
			if( error ) _Error(error);

			console.log("Created Account " + account.name, account._id);

			process.exit(0);
		});
	})
};

RegisterCommand('listAccounts', '', 'Lists all accounts.');
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

RegisterCommand('createTag', 'accountid', 'Creates a Tag for the specified account.');
var CreateTag = function( accountid ) {
	if( !accountid )
		return _Error("Specify an account id to create a user for.");

	Account
		.findById(accountid)
		.exec(function(error, account) {
			if( error )
				return _Error(error);

			if( account == null )
				return _Error("Account not found.");

			prompt.start();
			prompt.get(['name'], function( err, result ) {
				var tag = new Tag({
					name: result.name,
					account: account
				});
				tag.save(function(error) {
					if( error )
						return _Error(error);

					process.exit(0);
				});
			});
		});
};

RegisterCommand('deleteOrphanAccounts', '', 'Deletes all accounts that do not have users assigned.');
var DeleteOrphanAccounts = function() {
	User.find(function(err, result) {
		var accounts = [];
		for( var index in result ) {
			var user = result[index];
			var account = String(user.account);
			if( accounts.indexOf(account) == -1 )
				accounts.push(account);
		}

		Account.find({
			_id: {
				$nin: accounts
			}
		}, function(err, result) {
			var length = result.length;
			for( var index in result ) {
				result[index].remove();
			}

			console.log(result.length, "Accounts removed");
			process.exit(0);
		});
	});
};

var command = argv._[0];
switch( command ) {
	case 'createAccount':
		CreateAccount();
		break;
	case 'createUser':
		CreateUser(argv._[1]);
		break;
	case 'listUsers':
		ListUsers(argv._[1]);
		break;
	case 'listAccounts':
		ListAccounts();
		break;
	case 'createTag':
		CreateTag(argv._[1]);
		break;
	case 'deleteOrphanAccounts':
		DeleteOrphanAccounts();
		break;
	default:
		if( command )
			console.log('Command '+ command +' not found.');
		PrintCommands();
		process.exit(1);
}