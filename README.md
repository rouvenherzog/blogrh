# rouvenherzog
rouvenherzog is a simple, pluggable NodeJS blogging and gallery content management system. It's highly flexible as it plugs in a backend to handle a blog and gallery only. How you use the created entries is up to you.

## Prerequisite
You have a Express Application set up. This is necesarry, since rouvenherzog only plugs into your existing app. This gives you total flexibility how to use the created objects.

If you haven't set up an express app yet, check out the demo or head over to expressjs.com to get started.

## Installation and Set up
Install the plugin from npm

	npm install rouvenherzog --save

In order to login you need to create an account and at least one user first.
rouvenherzog offers command line interface to do these tasks. Navigate with a console
into your application directory and run the following commands. You will be prompted to insert
the required information during the process.

	rouvenherzog createAccount
	rouvenherzog createUser `accountid`

Now in your apps configuration, require and register the plugin.

``` javascript
	var rouvenherzog = require('rouvenherzog');
	rouvenherzog.register(app, config);
```

There are some fields that are required in the config block. Check out @Configuration below for more details.
If you run your server and head over to `/admin`, you will see the admin already.

## Configuration
| key | default | description |
|-----|---------|-------------|
|a|b||
