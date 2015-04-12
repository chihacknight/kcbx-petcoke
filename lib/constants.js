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

define("help_url", "");

define("WIND_STATUS_TERMS", [
	{ threshold:  0, term: "Mild"},
	{ threshold: 10, term: "Moderate"},
	{ threshold: 15, term: "Hazardous"}
]);
