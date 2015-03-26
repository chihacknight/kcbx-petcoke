var async = require('async');
var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var pg = require('pg');
var db_url = process.env.DATABASE_URL;
var grunt = require('grunt');

exports.up = function(db, callback) {
  var qry = "CREATE TABLE weather_data("
    qry += "id             serial PRIMARY KEY, "
    qry += "logged_at      timestamp NOT NULL DEFAULT current_timestamp, "
    qry += "wind_speed     decimal NOT NULL, "
    qry += "wind_direction integer NOT NULL, "
    qry += "wind_gusts     decimal, "
    qry += "temperature    decimal NOT NULL, "
    qry += "humidity       decimal NOT NULL, "
    qry += "description    text NOT NULL, ",
    qry += "station        text"
  qry += ");"

  pg.connect(db_url, function(err, client, done){
    client.query(qry, function(err, rslt){
      done();
      if (err) grunt.log.error(err);
      client.end();
      callback();
    })
  })
};

exports.down = function(db, callback) {
  pg.connect(db_url, function(err, client, done){
    client.query("DROP TABLE weather_data", function(err, rslt){
      done();
      if (err) grunt.log.error(err);
      client.end();
      callback();
    })
  })
};
