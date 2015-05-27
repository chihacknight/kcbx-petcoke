var cwd = process.cwd();

var Handlebars = require('hbs');
var formatter = require(cwd + "/lib/formatter");
var moment = require("moment")
var numeral = require('numeral');
var i18n = require('i18next');
var _ = require("lodash");

var helpers = {

  degreeToCompass: function(deg, abbr) {
    return formatter.degreeToCompass(deg, abbr);
  },

  ifEqEq: function(a, b) {
    return a == b;
  },

  ifEqEqEq: function(a, b) {
    return a === b;
  },

  formatDate: function(d, fmt) {
    return moment(d).format(fmt);
  },

  formatUnixDate: function(d, fmt) {
    d = d * 1000;
    return helpers.formatDate(d, fmt);
  },

  // see numeraljs.com for formatting documentation
  formatNumber: function(num, fmt) {
    return numeral(num).format(fmt);
  },

  formatPhoneNumber: function (num) {
    num = num.toString();
    return formatter.formatPhone(num);
  },

  t: function(i18n_key) {
  var result = i18n.t(i18n_key);

  return new Handlebars.SafeString(result);
  }

};


module.exports.register = function(hbs){
  _.each(helpers, function(helper, name){
    hbs.registerHelper(name, helper);
  });
};
