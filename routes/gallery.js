/*
 * GET gallery docs.
 */

exports.docs = function(req, res, next) {
	var path = require('path'),
		fs = require('fs'),
		marked = require('marked'),
		version = req.params.version,
		title = req.params.title,
		baseUrl = process.cwd(),
		urlPath = [
			baseUrl, '/gallery/',
			title, '/',
			version, '/doc/',
			title, '.md'].join('');

	var filePath = path.normalize('/' + urlPath);

	fs.exists(filePath, function(exists) {
		if (exists) {
			var content = fs.readFileSync(filePath, 'utf-8');
			var tokens = marked.lexer(content);
			var htmlContent = marked.parser(tokens);
			res.render('show', {
				title: title,
				blogContent: htmlContent,
				pretty: true
			});
		} else {
			next();
		}
	});
};