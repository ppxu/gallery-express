var path = require('path'),
	fs = require('fs'),
	marked = require('marked');

exports.docs = function(req, res, next) {
	var version = req.params.version,
		title = req.params.title,
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, '../' + title, './' + version, './doc', './' + title + '.md');

	fs.exists(urlPath, function(exists) {
		if (exists) {
			var content = fs.readFileSync(urlPath, 'utf-8');
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