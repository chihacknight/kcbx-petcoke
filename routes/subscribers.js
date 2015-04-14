/**
 * This router is applied to the 
 * /subscribers base url in app.js
 */

var cwd = process.cwd();
var express = require('express');
var router = express.Router();
var wufoo = require(cwd + '/services/wufoo');
var formatter = require(cwd + "/lib/formatter")


router.post("/", function(req, res){
  var phone = formatter.normalizePhone(req.body.phone);
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


module.exports = router;