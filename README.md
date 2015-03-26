# blogrh
node module
plugs into express app
adds backend to manage blog entries and media
flexible - use of objects is up to you
multilpe user
runs using mongodb and redis

blogrh is a simple blogging cms that plugs into yourx express app and adds a backend to create and modify blog entries, as well as upload and tag images. How you display the created information is up to you. Simply query the objects you want to display in your route. blogrh runs on mongodb and uses redis for caching. You might as well use the same database for multiple instances of blogrh, since it offers a mutiple user system.

blogrh is a simple, pluggable NodeJS blogging and gallery content management system. It's highly flexible as it plugs in a backend to handle a blog and gallery only. How you use the created entries is up to you.

[Check out the Demo!](http://blogrh.rouvenherzog.me)

## Prerequisite
You have a Express Application set up. This is necesarry, since blogrh only plugs into your existing app. This gives you total flexibility how to use the created objects.

If you haven't set up an express app yet, check out the demo or head over to [expressjs](http://www.expressjs.com) to get started.

Additionally, you'll have to have a mongodb available. This plugin uses mongodb to store users, blog entries and media. Instructions how to install mongodb are [here](http://docs.mongodb.org/manual/installation/).

blogrh uses Redis as cache for piwik requests and sessions. Be sure to have [redis up and running](http://redis.io/topics/quickstart) before starting the app. By default the app connects to a redis instance running at `localhost:6379`. You can change the host and port in the [configs](#configuration).

## Commandline
By default all changes from the command line happen under `mongodb://localhost/blogrh`. Reading: The database blogrh on localhost. If you want to change the host and/or database add the parameter `--database <mongodb://host/database>` to your command. For instance:
    
    // To create an Account in the database mydatabase
    rouveherzog createAccount --database mongodb://localhost/mydatabase
    // To create a User in the database mydatabase
    blogrh createUser <accountid> --database mongodb://localhost/mydatabase

## Installation and Set up
Install the plugin from npm

	npm install blogrh [--save]

In order to login you need to create an account and at least one user first.
blogrh offers a command line interface to do these tasks. [**Read the paragraph about the commandline first**](#commandline) to make sure you're adding objects to the right database. Now navigate with a console
into your application directory and run the following commands. You will be prompted to insert the required information during the process. 

    blogrh createAccount // This outputs an account id ..
	blogrh createUser <accountid> // .. insert this id here
	
Why do you have to create an account? This plugin works with multiple sites sharing one database as well. Additionally you might of course change the `database` field whilst registering the plugin to specify a database per site. Up to you. In any case you'll have to provide the account id when registering the backend. Only objects that are linked to that account will be displayed and editable.

Now in your apps configuration, require and register the plugin.

``` javascript
    // Example configuration. Check below for details
    var config = {
	    account: 'objectId',
	    uploaddir: __dirname + '/static/uploads',
	    uploadroot: '/static/uploads',
	    piwik: {...},
	    secrets: {
	        cookie: 'secretCookieKey',
	        session: 'secretSessionKey'
	    },
	    redis: {
	        host: 'localhost',
	        port: '6379'
	    }
	};
	
	var blogrh = require('blogrh');
	blogrh.register(app, config);
```

There are two fields that are required in the config block. These are `account` and `uploaddir`.
As stated above, `account` is the account id you generated. All objects created in the backend will be linked to this account and only objects linked to this account will appear in the backend. If you forgot the id run this command to list the Accounts you created:
    
    blogrh listAccounts

`uploaddir` is the directory all images in the backend get uploaded to. This directory needs the same rights as the webserver to write files. Usually this is www-data. [Run into problems here?](https://www.google.de/search?q=how%20to%20change%20directory%20permission%20in%20...)

## Configuration
| key | default | description |
|-----|---------|-------------|
| account || **required** The Stringified monogodb account id. Run `blogrh listAccounts` to find the account id you generated earlier if you followed the steps above.
| uploaddir|| **required** The directory user uploaded files get stored in. Specify a directory you'll be able to serve those files from. For instance a subdirectoy of your `public` Folder.
| uploadroot| /static/uploads | The URL prefix for uploaded documents. Media objects have `path` fields that concatenate this path with the filename.
| piwik| `null` | The dashboard fetches recent data from piwik analytics if specified. *Google Analytics support might be avaialable in the future.*  [See below](#piwik) for further information.
| secrets || An object with two fields of type String: `session` and `cookie`. Those strings are secret keys the sessions and cookies get secured with. If not provided those keys get generated randomly. Only side effect of generated keys is that all users will get logged out on server restart since their sessions are not valid anymore.
| redis || Two fields again: `host` and `port`. The combination has to point at the address and port your redis instance runs at. By default his is localhost:6379.

## Further
For furhter information head over to [the wiki](https://github.com/blogrh/blogrh/wiki/00-Home).

### Piwik
If you track the visiters on your site you can fetch recent information and display them on the backends dashboard. [Piwik](http://www.piwik.org) is a free, open soure analytics tool that provides a variety of functionality to analyse user behaviour on your site.
To enable the Piwik dashboard simply provide your information when registering the backend. You find these information when you log in to piwik.

    blogrh.register( app, {
        ...,
        piwik: {
            siteUrl: piwik.myurl.com, // The base url your piwik is installed at
            siteId: 1, // The id of the site you are tracking
            authToken: 'randomAuthKey' // The authentication key generated by piwik
        }
    }