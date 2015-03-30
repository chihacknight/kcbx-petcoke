var Handlebars = require('hbs');
var moment = require("moment")
var numeral = require('numeral');
var _ = require("lodash");

var helpers = {

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
  }
}


module.exports.register = function(hbs){
  _.each(helpers, function(helper, name){
    hbs.registerHelper(name, helper);
  })
}
