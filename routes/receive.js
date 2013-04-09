/**
 * GET gallery docs.
 */
var path = require('path');
var fs = require('fs');

function writeLog(msg, detail){
  var time = new Date();
  var file = path.join(__dirname, "../public/receive/log.txt");
  var str = fs.readFileSync(file) + time + "\n";
  str += msg + "\n";
  if (detail) str += detail + "\n";
  str += "\n";
  fs.writeFileSync(file, str);
}

exports.write = function(req, res, next) {

  var payload = req.body.payload;
  var time = Date.now();
  var file = path.join(__dirname, '../public/receive/commits.json');
  var commits = '';

  if (!payload) {

    next();

  } else {

    fs.readFile(file, function(err, buf){

      if (err) {

        writeLog('文件打开错误');
        next();

      } else {

        commits += buf.toString();
        commits = JSON.parse(commits);
        commits[time] = JSON.parse(payload);

        fs.writeFile(file, JSON.stringify(commits, null, 2), function(err){

          if (err) {
            writeLog('commit记录写入失败', payload);
            next();
          } else {
            writeLog('commit记录写入成功');
          }

          res.json({"status": 200});

        });

      }

    });

  }

};

exports.commits = function(req, res, next){
  var file = path.join(__dirname, '../public/receive/commits.json');
  var emptyHistory = req.query.emptyHistory;
  fs.readFile(file, function(err, json){
    res.json(JSON.parse(json));
    //清空数据
    if (emptyHistory) fs.writeFileSync(file, '{}');
  });
};

exports.log = function(req, res, next){
  var file = path.join(__dirname, '../public/receive/log.txt');
  var emptyHistory = req.query.emptyHistory;
  fs.readFile(file, function(err, json){
    res.send(json.toString());
    //清空数据
    if (emptyHistory) fs.writeFileSync(file, '');
  });
};
