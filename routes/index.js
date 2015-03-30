var express = require('express');
var router = express.Router();
var windspeed = require('../middleware/windspeed')

router.use(windspeed)


var statusValues = {
	1: {
		human: "Safe(ish)",
		machine: "safe"
	},

	2: {
		human: "Moderate",
		machine: "moderate"
	},

	3: {
		human: "Hazardous",
		machine: "hazardous"
	}
}


/* GET home page. */
router.get('/', function(req, res) {

  var status = statusValues[req.wind.status]

  res.render('index', { 
  	bodyClass: "home " + status.machine,
  	wind: req.wind,
  	status: status.human
  });
});

/* GET about page */
router.get('/about', function(req, res){
  res.render('about', {
    bodyClass: "about"
  })
})

module.exports = router;
