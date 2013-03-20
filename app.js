/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/:title/:version', function(req, res, next) {
    var version = req.params.version;
    var title = req.params.title;
    var urlPath = [
    __dirname, '/gallery/',
    title, '/',
    version, '/doc/',
    title, '.md'].join('');

    var filePath = path.normalize('./' + urlPath);

    fs.exists(filePath, function(exists) {
        if (exists) {
            var content = fs.readFileSync(filePath, 'utf-8');
            var tokens = marked.lexer(content);
            var html_content = marked.parser(tokens);
            res.render('show', {
                title: title,
                blog_content: html_content,
                pretty: true
            });
        } else {
            next();
        }
    });
});

app.get('*', function(req, res) {
    res.render('404', {
        title: '404',
        pretty: true
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});