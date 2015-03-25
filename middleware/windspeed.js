var request = require('request')
  , owmApiUrl = "http://api.openweathermap.org/data/2.5/weather?lat=41.703292&lon=-87.5489839&APPID=" + process.env.OPEN_WEATHER_API_KEY
  ;

var lastPoll = 0
  , pollingInterval = 5000
  , speedThreshold = 15
  ;

var wind = {};

module.exports = function(req, res, next){

	var now = new Date();
	var thisPoll = now.getTime();
	var sinceLastPoll = thisPoll - lastPoll;
	req.wind = wind;
	
	if (sinceLastPoll < pollingInterval) {
		return next();
	}

	request(owmApiUrl, function(err, response, data){
		data = JSON.parse(data);
		if (data && data.wind) {
			lastPoll = thisPoll;
			wind = data.wind;
			wind.direction = degreeToCompass(wind.deg);

			wind.status = 1;
			if (wind.speed >= speedThreshold) {
				wind.status = 3;
			} else if (wind.gust >= speedThreshold) {
				wind.status = 2
			}

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