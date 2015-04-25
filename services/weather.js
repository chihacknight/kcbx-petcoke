var cwd = process.cwd();

require(cwd + "/lib/env");
var fioApiKey = process.env.FORECAST_IO_API_KEY;

// 4 minutes and 30 seconds, because
// we'll be logging every 5 minutes and we
// want to make sure we get fresh data on
// each poll.
var cacheExpiration = (4 * 60) + 30;
// var cacheExpiration = 5;

var cache = require('memjs').Client.create();
var ForecastIo = require('forecast.io');
var forecastIo = new ForecastIo({APIKey: fioApiKey});

module.exports = {

  getForecast: function(lat, lng, callback) {
    var cacheKey = "weather.forecast:" + lat + "," + lng
    cache.get(cacheKey, function(mcErr, fc){
      if (mcErr) console.error(mcErr);
      
      if (fc)  {
        cache.close();
        return callback(null, JSON.parse(fc));
      }

      forecastIo.get(lat, lng, function(fioErr, res, data){
        if (fioErr) return callback(fioErr);

        var fc = data;

        var ret = {
          time_queried   : fc.currently.time,
          currently: {
            wind_speed     : fc.currently.windSpeed,
            wind_bearing   : fc.currently.windBearing,
            temperature    : fc.currently.temperature,
            humidity       : fc.currently.humidity,
            description    : fc.currently.summary,
            time           : fc.currently.time
          },

          raw_data: data
        }

        cache.set(cacheKey, JSON.stringify(ret), function(err, success){
          if (err) console.log(err);
          cache.close();
          callback(fioErr, ret);
        }, cacheExpiration)
      })

    })
  }
}
