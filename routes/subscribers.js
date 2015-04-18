/**
 * This router is applied to the 
 * /subscribers base url in app.js
 */

var cwd = process.cwd();
var express = require('express');
var router = express.Router();
var smsSubcriberService = require(cwd + '/services/smsSubscriber');
var formatter = require(cwd + "/lib/formatter")


router.post("/", function(req, res){

  var phone = req.body.phone;
  smsSubcriberService.addSubscriber(phone, function(err, rslt){
    
    if (!err)
      return res.json(rslt);


    console.error(err);
    switch (err.type) {

      case "BAD_PARAM":
      case "DUPLICATE_PARAM":
        return res.status(400).json({
          success: false,
          message: err.message
        });
        break;

      default:
        return res.status(500).json({
          success: false,
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


    console.error(err);
    switch(err.type) {
      case "NOT_FOUND":
        return res.status(404).json({
          success: false,
          message: err.message
        });
        break;

      default:
        return res.status(500).json({
          success: false,
          message: "Internal Server Error"
        });
        break;
    }
  })
})

module.exports = router;