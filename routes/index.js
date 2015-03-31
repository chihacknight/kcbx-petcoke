var express = require('express');
var router = express.Router();
var windspeed = require('../middleware/windspeed')

router.use(windspeed)


var statusTerms = {
	1: "Mild",
	2: "Moderate",
	3: "Hazardous"
}


/* GET home page. */
router.get('/', function(req, res) {

  var statusTerm = statusTerms[req.wind.status]

  res.render('index', {
  	bodyClass: "home wind-level-" + req.wind.status,
  	wind: req.wind,
  	status: statusTerm
  });
});


module.exports = router;
