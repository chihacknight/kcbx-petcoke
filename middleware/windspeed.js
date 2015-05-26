var cwd = process.cwd();
var constants = require(cwd + '/lib/constants')
var request = require('request')
var weather = require(cwd + '/services/weather')

module.exports = function(req, res, next){

	weather.getForecast(constants.station_location.lat, constants.station_location.lng, function(err, data){
		if (data) {
			var wind = {
				speed     : data.currently.wind_speed,
				bearing   : data.currently.wind_bearing,
				timeTaken : data.currently.time
			}

			wind.status = windStatus(data.currently.wind_speed)

			req.wind = wind;
			res.locals.wind = wind;
			res.locals.windLevel = "wind-level-" + wind.status.level
			req.location = constants.station_name;
		}
		next();
	});

}

function windStatus(speed) {
	var statusTerms = constants.WIND_STATUS_TERMS;
	for (var i=statusTerms.length-1; i>=0; i--) {
		var status = statusTerms[i];
		if (speed >= status.threshold) {
			return {
				level: i,
				term : status.term
			};
		}
	}
}
