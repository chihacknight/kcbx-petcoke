var express = require('express');
var router = express.Router();
var constants = require('../lib/constants')
var windspeed = require('../middleware/windspeed')

router.use(windspeed)

/* GET home page. */
router.get('/', function(req, res) {

  var statusTerm = constants.WIND_STATUS_TERMS[req.wind.status]

  res.render('index', {
  	bodyClass: "home wind-level-" + req.wind.status.level,
  	wind: req.wind,
  	status: statusTerm,
    location: req.location
  });
});


router.get('/subscribe', function(req, res){
  res.render('subscribe', {
    bodyClass: 'subscribe'
  });
});

router.get('/take-action', function(req, res){
  res.render('take-action', {
    bodyClass: 'take-action'
  })
})


module.exports = router;
