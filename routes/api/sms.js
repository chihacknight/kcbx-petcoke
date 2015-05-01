var cwd = process.cwd();

var router = require('express').Router();
var notifications = require(cwd + '/services/notifications');


/**
 * POST /api/sms
 *
 * Accepts incoming SMS messages from Twilio, passes them to the
 * notifications service in order to get the appropriate TwiML
 * response, and returns that as a reply to the sender;
 */
router.post('/', function(req, res){

  notifications.handleIncomingSms(req, function(err, twiml){
    res.send(twiml);
  });
})

module.exports = router;
