var q = require('q');
var http = require('http');
var querystring = require('querystring');

module.exports.query = function( siteId, token_auth ) {
	var a = q.defer();

	var query = querystring.stringify({
		module: 'API',
		method: 'API.getBulkRequest',
		token_auth: token_auth,
		format: 'json',

		"urls[0]": querystring.stringify({
			idSite: siteId,
			method: 'API.get',
			period: 'day',
			date: 'last14'
		}),
		"urls[1]": querystring.stringify({
			idSite: siteId,
			method: 'DevicesDetection.getType',
			period: 'range',
			date: 'last14'
		})
	});

	console.log(query);

	http.get(
		'http://piwik.rouvenherzog.me/?' + query,
		function(res) {
			var result = "";

			res.on('data', function(data) {
				result += data.toString();
			});

			res.on('end', function() {
				a.resolve(result);
			});
		}
	)

	return a.promise;
};