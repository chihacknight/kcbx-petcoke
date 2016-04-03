/** 
 * This is a service for communicating with the google
 * fusion table that stores the SMS subscriber numbers
 */

var cwd = process.cwd();
require(cwd + "/lib/env");

var formatter = require(cwd + "/lib/formatter");
var google = require('googleapis');
var fusion = google.fusiontables('v2');
var i18next = require('i18next');
var moment = require('moment');
var _ = require('lodash');

var googleApiPem       = process.env.GOOGLE_AUTH_PEM;
var googleApiEmail     = process.env.GOOGLE_AUTH_EMAIL;
var googleAccountEmail = process.env.GOOGLE_ACCOUNT_EMAIL;
var tableId            = process.env.GOOGLE_FUSION_TABLE_ID;

var allCols = ["ROWID", "phone", "createdAt", "locale"]

var jwtClient = new google.auth.JWT(
  googleApiEmail,
  null,
  googleApiPem,
  ['https://www.googleapis.com/auth/fusiontables'],
  googleAccountEmail
)


module.exports = {


  addSubscriber: function(params, callback) {
    var number = formatter.normalizePhone(params.number);
    var locale = params.locale || 'en-US';
    callback = callback || function(){};
    var createdAt = moment().format("YYYY-MM-DD HH:mm:ss")
    if (!number) {
      return callback({
        type: "BAD_PARAM",
        message: i18next.t("errors.badPhoneNumber")
      })
    }

    // stub for test environment
    if (process.env.USE_TEST_RECIPIENT === 'true') {
      return callback(null, { phone: number, createdAt: createdAt, locale: locale, stubbed: true })
    }


    var sql = "INSERT INTO " + tableId + " (phone, createdAt, locale) VALUES (" + number + ", '" + createdAt + "', '" + locale + "')";

    this.getSubscribers(function(getErr, subscribers){
      if (getErr) { return callback(getErr); };
      try {
        if (!!_.find(subscribers, {phone: number})) {
          var formatted = formatter.formatPhone(number)
          return callback({
            type: "DUPLICATE_PARAM",
            message: i18next.t("errors.alreadySubscribed", { number: formatted} )
          });
        }
      } catch(e) {
        return callback(e);
      }

      jwtClient.authorize(function(jwtErr, tokens){      
        if (jwtErr) { return callback(jwtErr); }

        fusion.query.sql({ 
          auth : jwtClient,
          sql  : sql
        }, function(tblErr, rslt){
          if (tblErr) { return callback(jwtErr); }

          callback(null, {
            rowid: rslt.rows[0][0],
            phone: rslt.rows[0][1], 
            createdAt: rslt.rows[0][2], 
            locale: rslt.rows[0][3]
          })
        });
      })
    })
  },

  removeSubscriber: function(number, callback) {
    var that = this;
    callback = callback || function(){};
    number = formatter.normalizePhone(number);
    if (!number) {
      return callback({
        type: "BAD_PARAM",
        message: i18next.t("errors.badPhoneNumber")
      })
    }

    jwtClient.authorize(function(jwtErr){
      if (jwtErr) { return callback(jwtErr); }

      that.getSubscriber(number, function(getErr, row){
        if (getErr) { return callback(getErr); }

        var formatted = formatter.formatPhone(number)
        if (!row) return callback({
          type: "NOT_FOUND",
          message: i18next.t("errors.numberNotFound", {number: formatted})
        })

        var sql = "DELETE FROM " + tableId + " WHERE ROWID = '" + row.rowid + "'";

        fusion.query.sql({
          auth: jwtClient,
          sql: sql,
        }, function(tblErr, rslt){
          var deleted = !!parseInt(rslt.rows[0][0]);
          callback(tblErr, deleted);
        })
        
      })

    })
  },

  getSubscribers: function(callback) {

    // stub for test environment
    if (process.env.USE_TEST_RECIPIENT === 'true') {
      return callback(null, [{
        phone: process.env.TEST_RECIPIENT, 
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        stubbed: true
      }])
    }

    var sql = "SELECT * FROM " + tableId;
    jwtClient.authorize(function(jwtErr, tokens){
      if (jwtErr) { return callback(jwtErr); }

      fusion.query.sqlGet({
        auth: jwtClient,
        sql:sql
      }, function(tblErr, rslt){
        if (tblErr) { return callback(jwtErr); }
        var objects = buildObjectsFromSqlResponse(rslt);
        callback(null, objects);
      })
    })
  },

  getSubscriber: function(number, callback) {
    number = formatter.normalizePhone(number);
    if (!number) return callback({
      type: "BAD_PARAM",
      message: i18next("errors.badPhoneNumber")
    });

    jwtClient.authorize(function(jwtErr){
      if (jwtErr) { return callback(jwtErr); }

      fusion.query.sqlGet({
        auth: jwtClient,
        sql: "SELECT " + allCols.join(',') + " FROM " + tableId + " WHERE phone=" + number
      }, function(tblErr, rslt){
        if (tblErr) return callback(tblErr);
        
        rslt = buildObjectsFromSqlResponse(rslt)[0];
        callback(null, rslt);
      })
    })
  },

  setLanguagePreference: function(number, locale, callback) {
    var service = this;
    number = formatter.normalizePhone(number);
    if (!number) return callback({
      type: "BAD_PARAM",
      message: i18next("errors.badPhoneNumber")
    });

    // locale = _.contains(['en-US','es-US'], locale) ? locale : 'en-US';
    service.getSubscriber(number, function(err, subscriber){
      jwtClient.authorize(function(jwtErr){
        if (jwtErr) { return callback(jwtErr); }

        var sql = "UPDATE " + tableId + " SET locale='" + locale + "' WHERE ROWID='" + subscriber.rowid + "'";
        fusion.query.sql({
          auth: jwtClient,
          sql: sql
        }, function(tblErr, rslt){
          if (tblErr) return callback(tblErr);
          service.getSubscriber(number, callback);
        })
      })
    })
  }
}


function buildObjectsFromSqlResponse(rslt) {
  var objects = [];
  if (!rslt || !rslt.rows) { return objects; }

  _.each(rslt.rows, function(row){
    var object = {}
    _.each(row, function(value, columnIdx){
      var column = rslt.columns[columnIdx]
      object[column] = value;
    })
    objects.push(object)
  })
  return objects;
}
