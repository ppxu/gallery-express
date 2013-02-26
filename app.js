
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , markdown = require('markdown-js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.engine('md', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    str = markdown.parse(str).toString();
    fn(null, str);
  });
});

app.get('/', routes.index);

app.get('/:title', function(req, res, next) {
    var urlPath = [
        __dirname, '/',
        req.params.title, '/',
        req.params.title, '.md'
    ].join('');

    var filePath = path.normalize('./' + urlPath);

    fs.exists(filePath, function(exists){
      if(exists){
        var content = fs.readFileSync(filePath, 'utf-8');
        var html_content = markdown.parse(content);
        // res.render(filePath, {layout: false});
        res.render('show', {
            title: req.params.title,
            blog_content: html_content,
            pretty: true
        });
      }
      else{
        next();
      }
    });
});

app.get('*', function(req, res) {
    res.render('404', {
        title: '404'
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
