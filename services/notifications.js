var cwd = process.cwd();
require(cwd + "/lib/env");

var async = require('async');
var constants = require(cwd + "/lib/constants");
var smsSubscriber = require(cwd + "/services/smsSubscriber");
var	twilio = require('twilio');
var twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var _ = require('lodash');


var messageHandlers = {

	// subscribe messages, defined by twilio
	'subscribe'   : 'incomingSubscribe',
	'start'       : 'incomingSubscribe',
	'yes'         : 'incomingSubscribe',
	'subscribir'  : 'incomingSubscribe',

	// unsubscribe messages, defined by twilio
	'unsubscribe' : 'incomingUnsubscribe',
	'stop'        : 'incomingUnsubscribe',
	'stopall'     : 'incomingUnsubscribe',
	'cancel'      : 'incomingUnsubscribe',
	'end'         : 'incomingUnsubscribe',
	'quit'        : 'incomingUnsubscribe',

	// info messages for twilio, no output necessary
	'help'        : 'noop',
	'info'        : 'noop',

	// responses that indicate a bad number.
	// remove them from the list, but DON'T send a response so as
	// not to start an auto-reply loop.
	"this is not a working number" : "incomingSilentUnsubscribe"
};

module.exports = {

	/**
	 * Takes incoming request object from /api/sms and routes
	 * to appropriate handler, returning its TwiML response
	 *
	 * @param req
	 * @returns TwiML response for return message
	 */
	handleIncomingSms: function(req, cb) {
		var message = req.body.Body.toLowerCase().trim();
		var handlerKey = messageHandlers[message];

		var handler = handlerKey ? module.exports[handlerKey] : module.exports.incomingUnknown;
		req.locale = inferLocale(message);
		console.log(message);
		return handler(req, cb);
	},


	/**
	 * Sends a message to all subscribers
	 */
	broadcast: function(message, callback) {
		var that = this;

		smsSubscriber.getSubscribers(function(err, subscribers){
			if (err) return callback(err);

			var qu = async.queue(function(subscriber, next){
				process.stdout.write('.');

				var locale = subscriber.locale || 'en-US';
				var message = constants.alertMessage[locale];
				var number = subscriber.phone;

				that.sendMessage(number, message, next);
			}, 20);

			_.each(subscribers, qu.push);

			qu.drain = function(){
				callback();
			};

			qu.process();
		})
	},

	sendMessage: function(number, message, callback) {
		twilioClient.sendMessage({
			to: number,
			from: process.env.TWILIO_FROM_NUMBER,
			body: message
		}, callback);
	},

	incomingUnknown: function(req, cb) {
		var twiml = new twilio.TwimlResponse();
		var validResponses = _.keys(messageHandlers);
		twiml.message("This is an automated service. To unsubscribe, reply with STOP");
		return cb(null, twiml);
	},

	incomingSubscribe: function(req, cb) {
		var twiml = new twilio.TwimlResponse;
		smsSubscriber.addSubscriber({
			number: req.body.From,
			locale: req.locale
		}, function(err){
			var successMessage = "We've subscribed you to air quality alerts. Thanks!";
			var message = (err) ? err.message : successMessage;
			twiml.message(message);
		 	cb(null, twiml);
		})
	},

	incomingUnsubscribe: function(req, cb) {
		var twiml = new twilio.TwimlResponse;
		var phone = req.body.From;
		smsSubscriber.removeSubscriber(phone, function(err){
			var successMessage = "We've unsubscribed you from air quality alerts. Sorry to see you go!";
			var message = (err) ? err.message : successMessage;
			twiml.message(message);
		 	cb(null, twiml);
		})
	},

	incomingSilentUnsubscribe: function(req, cb) {
		var phone = req.body.From;
		smsSubscriber.removeSubscriber(phone, function(err){
			cb(err, null);
		})
	},

	noop: function() {}
};

function inferLocale(message) {
	var locale = 'en-US';
	
	switch (message) {
		// add fall-throughs here as necessary
		case "subscribir":
			locale = 'es-US';
			break;
	}

	return locale;
}
