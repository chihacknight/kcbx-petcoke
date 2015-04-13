/**
 * This router is applied to the 
 * /subscribers base url in app.js
 */

var cwd = process.cwd();
var express = require('express');
var router = express.Router();
var wufoo = require(cwd + '/services/wufoo');


router.post("/", function(req, res){
  var phone = normalizePhone(req.body.phone);
  if (!phone) {
    return resp.status(400).json({
      success: false,
      message: "Please enter a valid 10-digit US phone number"
    })
  }

  wufoo.addSmsSubscriber(phone, function(err, resp, body){
    body = JSON.parse(body);
    var subscriber = body.Success ? { phone: phone } : null
    var statusCode = (resp.statusCode === 200 && !body.Success) ? 400 : resp.statusCode;

    res.status(statusCode).json({ 
      success: body.Success,
      subscriber: subscriber,
      error: body.FieldErrors || body.ErrorText || null
    });
  })
})


router.delete("/", function(req, res){
  res.send("not yet implemented")
})



/**
 * Normalizes phone number to digits only.
 * 
 * Returns 10 digit string or empty string if phone number is malformed
 */
function normalizePhone(phone) {
  phone = phone || "";
  phone = phone.replace(/[^\d]/g, '');

  if (phone[0] === '1')
    phone = phone.substring(1);

  if (phone.length != 10)
    return '';

  return phone;
}


/**
 * Formats phone number to form (XXX) XXX-XXXX
 * Returns empty string if phone number is malformed
 */
function formatPhone(phone) {
  phone = normalizePhone(phone)
  if (!phone)
    return "";

  var ac   = phone.substr(0, 3);
  var exch = phone.substr(3, 3);
  var rem  = phone.substr(6);

  return "(" + ac + ") " + exch + "-" + rem;
}


module.exports = router;