/**
 * This router is applied to the 
 * /subscribers base url in app.js
 */

var cwd = process.cwd();
var express = require('express');
var router = express.Router();
var smsSubcriberService = require(cwd + '/services/smsSubscriber');
var formatter = require(cwd + "/lib/formatter");
var i18next = require('i18next');


router.post("/", function(req, res){

  var phone = req.body.phone;
  smsSubcriberService.addSubscriber({
    number: phone,
    locale: i18next.lng()
  }, function(err, rslt){
    
    if (!err)
      return res.json(rslt);


    switch (err.type) {

      case "BAD_PARAM":
      case "DUPLICATE_PARAM":
        return res.status(400).json({
          error: true,
          message: err.message
        });
        break;

      default:
        return res.status(500).json({
          error: true,
          message: "Internal Server Error"
        });
        break;
    }

  })

})

router.delete("/:phone", function(req, res){
  var phone = req.params.phone;
  smsSubcriberService.removeSubscriber(phone, function(err, rslt){
    if (!err)
      return res.json(rslt);


    switch(err.type) {
      case "NOT_FOUND":
        return res.status(404).json({
          error: true,
          message: err.message
        });
        break;

      default:
        return res.status(500).json({
          error: true,
          message: "Internal Server Error"
        });
        break;
    }
  })
})

module.exports = router;
