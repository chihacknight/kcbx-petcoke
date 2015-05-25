var Handlebars = require('hbs');
var moment = require("moment")
var numeral = require('numeral');
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
    return numeral(num).format(fmt)
  },

  // Modified from https://github.com/assemble/handlebars-helpers/blob/master/lib/helpers/helpers-numbers.js.
  formatPhoneNumber: function (num) {
    num = num.toString();
    return num[0] + " (" + num.substr(1, 3) + ") " + num.substr(4, 3) + "-" + num.substr(7, 4);
  }
}


module.exports.register = function(hbs){
  _.each(helpers, function(helper, name){
    hbs.registerHelper(name, helper);
  })
}
