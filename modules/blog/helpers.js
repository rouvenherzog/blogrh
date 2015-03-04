var q = require('q');
var convert = require('convert-rich-text');
var Entry = require('./models').Entry;
var _ = require('underscore');

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