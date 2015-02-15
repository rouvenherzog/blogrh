var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	uploaded_at: Date,
	path: String
});

var Media = function(){
};

module.exports = {
	Media: Media,
	MediaSchema: MediaSchema
};