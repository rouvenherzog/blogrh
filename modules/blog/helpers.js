var convert = require('convert-rich-text');

module.exports.render_delta = function( delta ) {
	return convert(delta, 'html', {
		block: {
			align: '<p style="text-align: {align}">{content}</p>'
		},
		inline: {
			size: '<span style="font-size: {size}">{content}</span>',
			color: '<span style="color: {color}">{content}</span>',
			background: '<span style="background-color: {background}">{content}</span>',
		}
	});
};