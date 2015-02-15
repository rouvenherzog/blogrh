var convert = require('convert-rich-text');

module.exports.render_delta = function( delta ) {
	return convert(delta, 'html', {});
};