var express = require('express'),
    router = express.Router(),
    constants = require('../lib/constants'),
    windspeed = require('../middleware/windspeed');

router.use(windspeed)

/* GET home page. */
router.get('/', function(req, res) {

  var statusTerm = constants.WIND_STATUS_TERMS[req.wind.status]

  res.render('index', {
  	bodyClass: "home",
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
    bodyClass: 'take-action',
    phoneNumber: constants.TAKE_ACTION_PHONE_NUMBER
  })
})


module.exports = router;
