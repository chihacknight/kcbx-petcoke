var cwd = process.cwd();
var constants = require(cwd + '/lib/constants')
var request = require('request')
var weather = require(cwd + '/lib/weatherService')

module.exports = function(req, res, next){

	weather.getForecast(constants.KCBX_LAT, constants.KCBX_LNG, function(err, data){
		if (data) {
			var wind = {
				speed     : data.currently.wind_speed,
				bearing   : data.currently.wind_bearing,
				direction : degreeToCompass(data.currently.wind_bearing),
				timeTaken : data.currently.time
			}

			wind.status = 1;
			
			if (wind.speed >= constants.WIND_MODERATE) 
				wind.status = 2;

			if (wind.speed >= constants.WIND_HAZARDOUS)
				wind.status = 3;

			req.wind = wind;
		}
		next()
	})

}

function degreeToCompass(deg) {
	if (337.5 <= deg || deg < 22.5)
		return "North";

	if ( 22.5 <= deg && deg < 67.5 )
		return "Northeast";

	if ( 67.5 <= deg && deg < 112.5 )
		return "East";

	if ( 112.5 <= deg && deg < 157.5 )
		return "Southeast";

	if ( 157.5 <= deg && deg < 202.5 )
		return "South";

	if ( 202.5 <= deg && deg < 247.5 )
		return "Southwest";

	if ( 247.5 <= deg && deg < 292.5 )
		return "West";

	if ( 292.5 <= deg && deg < 337.5 )
		return "Northwest";

}