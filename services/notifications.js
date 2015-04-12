require(cwd + "/lib/env");

var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var message = [
	'The current wind speed forecast at KCBX Terminals is ',
	windSpeed.toString() + ' mph.', 
	'??? see issue #2 ??? considers wind levels over ',
	_.find(constants.WIND_STATUS_TERMS, 'term', 'Hazardous').threshold + ' mph ',
	'to be hazardous. Read more at ' + constants.help_url + '.'
];

module.exports = {
	send: function(windSpeed, callback, subscriberNumber) {
		twilio.sendMessage({
			to: subscriberNumber,
			from: process.env.TWILIO_NUMBER,
			body: message.join('')
		}, callback);
	}
};