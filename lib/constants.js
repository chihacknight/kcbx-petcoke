/**
 * Thank you Dominic Barnes
 * https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules/8596808#8596808
 */

function define(name, value){
  Object.defineProperty(exports, name, {
    value      : value,
    enumerable : true,
    writable   : false
  })
}

define("station_location", { lat: 41.70, lng: -87.55 });
define("station_name", "KCBX Terminals");

// Minimum number of hours between
// SMS broadcasts about air quality
define("notification_rate_limit", 6);

// bit.ly link resolves to petcokealerts.org/take-action
var TAKE_ACTION_URL_EN = "http://petcokealerts.org";
define("TAKE_ACTION_URL_EN", TAKE_ACTION_URL_EN);

// bit.ly link resolves to petcokealerts.org/take-action?setLng=es-US
var TAKE_ACTION_URL_ES = "http://petcokealerts.org"
define("TAKE_ACTION_URL_ES", TAKE_ACTION_URL_ES);

define("WIND_STATUS_TERMS", [
	{ threshold:  0, term: "Normal"},
	{ threshold: 10, term: "Elevated"},
	{ threshold: 15, term: "Hazardous"}
]);

// The mayor's phone number.
define("TAKE_ACTION_PHONE_NUMBER", 13127443300);


define("alertMessage", {
  "en-US": 'Wind Alert! Avoid petcoke exposure by limiting outdoor activity. Learn more and take action at ' + TAKE_ACTION_URL_EN + '.',
  "es-US": "Alerta de viento! Evite la exposición petcoke al limitar la actividad al aire libre. Obtenga más información y tomar medidas al " + TAKE_ACTION_URL_ES + "."
})
