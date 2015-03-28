var db = require("../lib/db")
  ;


var WeatherDatum = db.client.define("WeatherDatum", {

  wind_speed: {
    type: db.module.FLOAT,
    required: true
  },

  wind_direction: {
    type: db.module.INTEGER,
    required: true
  },

  wind_gusts: {
    type: db.module.FLOAT,
  },

  temperature: {
    type: db.module.INTEGER,
    required: true
  },

  humidity: {
    type: db.module.INTEGER,
    required: true
  },

  description: {
    type: db.module.STRING,
    required: true
  }

}, {

  tableName: "weather_data"
})

WeatherDatum.sync();
module.exports = WeatherDatum;
