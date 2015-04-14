var cwd = process.cwd();
require(cwd + "/lib/env");
var	twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN),
	constants = require(cwd + "/lib/constants")
	_ = require('lodash');

module.exports = {
	sendWindAlert: function(windSpeed, subscriberNumber, callback) {
		var message = [
			'The current wind speed forecast at KCBX Terminals is ',
			windSpeed.toString() + ' mph.', 
			'??? see issue #2 ??? considers wind levels over ',
			_.find(constants.WIND_STATUS_TERMS, 'term', 'Hazardous').threshold + ' mph ',
			'to be hazardous. Read more at ' + constants.help_url + '.'
		];

		twilio.sendMessage({
			to: subscriberNumber,
			from: process.env.TWILIO_FROM_NUMBER,
			body: message.join('')
		}, callback);
	}
};