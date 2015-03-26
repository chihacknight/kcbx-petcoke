var Waterline = require('waterline')
  ;


var WeatherDatum = Waterline.Collection.extend({
  
  tableName: "weather_data",
  
  adapter: "postgresql",
  
  attributes : {
    
    logged_at: {
      type: 'datetime',
      required: true,
      defaults_to: Date.now
    },

    wind_speed: {
      type: "float",
      required: true
    },

    wind_direction: {
      type: "integer",
      required: true
    },

    wind_gusts: {
      type: "float",
    },

    temperature: {
      type: "float",
      required: true
    },

    humidity: {
      type: "integer",
      required: true
    },

    description: {
      type: "string",
      required: true
    }
  }
})

module.exports = WeatherDatum;