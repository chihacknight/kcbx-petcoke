var constants = require("../../lib/constants");
var moment = require("moment");

module.exports = {

  getForecast: {

    belowThreshold: function(lat, lng, cb) {
      return cb(null, {
        time_queried   : moment().format(),
        currently: {
          wind_speed     : 10,
          wind_bearing   : 270,
          temperature    : 60,
          humidity       : 50,
          description    : 'sunny',
          time           : moment().subtract(3, 'minutes')
        },
      });
    },

    aboveThreshold: function(lat, lng, cb) {
      return cb(null, {
        time_queried   : moment().format(),
        currently: {
          wind_speed     : 20,
          wind_bearing   : 270,
          temperature    : 60,
          humidity       : 50,
          description    : 'sunny',
          time           : moment().subtract(3, 'minutes')
        },
      });
    }

  }
}
