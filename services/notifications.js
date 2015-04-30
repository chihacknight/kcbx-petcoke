var cwd = process.cwd();
require(cwd + "/lib/env");
var	twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN),
	constants = require(cwd + "/lib/constants")
	_ = require('lodash');

module.exports = {
	sendWindAlert: function(windSpeed, subscriberNumber, callback) {
		var message = [
			'Wind Alert!',
			'The Chicago Department of Public Health recommends you limit',
			'outdoor activities to reduce petcoke exposure.',
			'More info at <url-tbd>.'
		];

		twilio.sendMessage({
			to: subscriberNumber,
			from: process.env.TWILIO_FROM_NUMBER,
			body: message.join(' ')
		}, callback);
	}
};