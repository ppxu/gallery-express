if (process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
} else {
  var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"db"
  }
}
var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');
  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}
var mongourl = generate_mongo_url(mongo);

function writeDb(collect, obj, callback){
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection(collect, function(err, coll){
      obj.ts = new Date();
      coll.insert(obj, {safe:true}, function(err){
        callback(err)
      });
    });
  });
}

function updateDb(collect, query, newValue, callback){
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection(collect, function(err, coll){
      coll.update(query, {$set: newValue}, {safe:true, upsert:true}, callback)
    });
  });
}

function getDb(collect, query, callback){
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection(collect, function(err, coll){
      coll.find(query, {limit:100, sort:[['_id','desc']]}, function(err, cursor){
        cursor.toArray(function(err, items){
          callback(err, items);
        });
      });
    });
  });
}

function removeDb(collect, callback){
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection(collect, function(err, coll){
      coll.drop(function(err){
        callback(err);
      });
    });
  });
}

exports.getDb = getDb;
exports.writeDb = writeDb;
exports.updateDb = updateDb;
exports.removeDb = removeDb;
