var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	name: String
});

var Tag = mongoose.model('Tag', TagSchema);

module.exports = {
	Tag: Tag
};