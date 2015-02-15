var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	uploaded_at: {
		type: Date,
		default: Date.now
	},
	path: String,
	title: String,

	tags: [{
		type: Schema.Types.ObjectId,
		ref: 'Tag'
	}]
});

var Media = mongoose.model('Media', MediaSchema);

module.exports = {
	Media: Media
};