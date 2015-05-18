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

	// unsubscribe messages, defined by twilio
	'unsubscribe' : 'incomingUnsubscribe',
	'stop'        : 'incomingUnsubscribe',
	'stopall'     : 'incomingUnsubscribe',
	'cancel'      : 'incomingUnsubscribe',
	'end'         : 'incomingUnsubscribe',
	'quit'        : 'incomingUnsubscribe',

	// info messages for twilio, no output necessary
	'help'        : 'noop',
	'info'        : 'noop'
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
		return handler(req, cb);
	},


	/**
	 * Sends a message to all subscribers
	 */
	broadcast: function(message, callback) {
		var that = this;

		smsSubscriber.getSubscribers(function(err, subscribers){
			if (err) return callback(err);

			var numbers = _.pluck(subscribers, 'phone')
			var funcs = [];
			_.each(numbers, function(number){
				var func = function(next){
					that.sendMessage(number, message, next);
				};
				funcs.push(func);
			});

			async.parallelLimit(funcs, 20, callback);
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
		validResponses = validResponses.join(', ')
		twiml.message("We didn't recognize that message. Please respond with one of: " + validResponses);
		return cb(null, twiml);
	},

	incomingSubscribe: function(req, cb) {
		var twiml = new twilio.TwimlResponse;
		var phone = req.body.From;
		smsSubscriber.addSubscriber(phone, function(err){
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


	noop: function() {}
};
