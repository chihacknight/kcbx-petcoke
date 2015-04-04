var cwd = process.cwd();
var constants = require(cwd + '/lib/constants')
var request = require('request')
var weather = require(cwd + '/services/weatherService')

module.exports = function(req, res, next){

	weather.getForecast(constants.KCBX_LAT, constants.KCBX_LNG, function(err, data){
		if (data) {
			var wind = {
				speed     : data.currently.wind_speed,
				bearing   : data.currently.wind_bearing,
				timeTaken : data.currently.time
			}

			wind.status = windStatus(data.currently.wind_speed)

			req.wind = wind;
		}
		next()
	})

}


function windStatus(speed) {
	var statusTerms = constants.WIND_STATUS_TERMS;
	for (var i=statusTerms.length-1; i>=0; i--) {
		var status = statusTerms[i];
		if (speed >= status.threshold) {
			return {
				level: i,
				term : status.term
			}
		}
	}
}
