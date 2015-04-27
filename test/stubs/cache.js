var constants = require("../../lib/constants");
var moment = require("moment");

module.exports = {
  notAvailable: function() {
    return {
      get: function(idx, cb) { cb("Connection Refused"); }
      set: function(idx, val, cb) { cb("Connection Refused"); }
    }
  }
}
