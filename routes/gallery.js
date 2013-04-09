/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked');

exports.docs = function(req, res, next) {
	var title1 = req.params.title1,
		version = req.params.version,
		title2 = req.params.title2,
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, '../' + title1, './gallery/' + title2, './' + version, './guide/index.md');

	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'utf8', function(err, data) {
				if (err) {
					next();
				} else {
					var tokens = marked.lexer(data);
					var htmlContent = marked.parser(tokens);
					res.render('show', {
						title: title2,
						blogContent: htmlContent,
						pretty: true
					});
				}
			});
		} else {
			next();
		}
	});
};