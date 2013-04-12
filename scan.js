/**
 * Created with JetBrains WebStorm.
 * User: exodia
 * Date: 13-4-11
 * Time: 下午10:27
 * To change this template use File | Settings | File Templates.
 */
var fs = require('fs');
var TIME =  24 * 60 * 60 * 1000;
var FILE_NAME = 'abc.json';

var scan = function (path, cb) {
    var result = {
        components: [],
        date: Date.now()
    };
    var dirs = fs.readdirSync(path),
        count = dirs.length;


    dirs.forEach(function (dir) {
        fs.readFile(path + '/' + dir + '/' + FILE_NAME, 'utf8', function (err, data) {
            if (data) {
                result.components.push(JSON.parse(data));
            } else {
                console.log(err);
            }

            if (--count == 0) {
                result.date = Date();
                fs.writeFile('./component-info.json', JSON.stringify(result), cb);
            }
        });
    });

};

exports.init = function (path) {

    var cb = function () {
        setTimeout(scan, TIME, path, cb);
    }

    scan(path, cb);
};

