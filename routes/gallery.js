/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked');

exports.docs = function(req, res, next) {
	var gallery = req.params[0],
		index = gallery.lastIndexOf('/'),
		title = index === -1 ? gallery : gallery.substring(index + 1),
		version = req.params[1],
		filename = req.params[2] ? req.params[2] : 'index',
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, '../' + gallery, './' + version, './guide/' + filename + '.md');

	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'utf8', function(err, data) {
				if (err) {
					next();
				} else {
					var tokens = marked.lexer(data);
					var htmlContent = marked.parser(tokens);
					res.render('show', {
						title: title,
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