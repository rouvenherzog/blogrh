var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database);
var db = mongoose.connection;

module.exports = db;