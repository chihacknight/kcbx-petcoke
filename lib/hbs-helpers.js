var cwd = process.cwd();

var Handlebars = require('hbs');
var formatter = require(cwd + "/lib/formatter");
var moment = require("moment")
var numeral = require('numeral');
var i18n = require('i18next');
var _ = require("lodash");

var helpers = {

  degreeToCompass: function(deg, abbr) {
    if (arguments.length === 2)
      abbr = false;

  	if (337.5 <= deg || deg < 22.5)
  		return abbr ? "N" : "North";

  	if ( 22.5 <= deg && deg < 67.5 )
  		return abbr ? "NE" : "Northeast";

  	if ( 67.5 <= deg && deg < 112.5 )
  		return abbr ? "E" : "East";

  	if ( 112.5 <= deg && deg < 157.5 )
  		return abbr ? "SE" : "Southeast";

  	if ( 157.5 <= deg && deg < 202.5 )
  		return abbr ? "S" : "South";

  	if ( 202.5 <= deg && deg < 247.5 )
  		return abbr ? "SW" : "Southwest";

  	if ( 247.5 <= deg && deg < 292.5 )
  		return abbr ? "W" : "West";

  	if ( 292.5 <= deg && deg < 337.5 )
  		return abbr ? "NW" : "Northwest";
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
