var cwd = process.cwd();
require(cwd + '/lib/env')
var Wufoo = require('wufoo');
var wufoo = new Wufoo(process.env.WUFOO_SUBDOMAIN, process.env.WUFOO_API_KEY);
var request = require('request');
var _ = require('lodash');


// Form field IDs
var FIELD_PHONE = 'Field1';


// Translating Wufoo's error messages to 
// more user-friendly messages
var friendlyErrorMap = {};
friendlyErrorMap[FIELD_PHONE] = {
  "This field requires a unique entry and this value was already submitted." : "That number is already in our system."
}

function friendlyError(field, error) {
  if (friendlyErrorMap[field] && friendlyErrorMap[field][error])
    return friendlyErrorMap[field][error];

  return error;
}





module.exports = {

  /**
   * Adds a subscriber to the SMS Subscribers form
   *
   * @param phone 10-digit phone number
   * @param callback The callback function
   */
  addSmsSubscriber: function(phone, callback) {
    var method = "POST";
    var uri = "https://" + process.env.WUFOO_SUBDOMAIN + ".wufoo.com/api/v3";
    uri += "/forms/" + process.env.WUFOO_SUBSCRIBER_FORM_ID + "/entries.json";
    var params = {};
    params[FIELD_PHONE] = phone;

    request({
      method: "POST",
      uri: uri, 
      form: params,
      headers: {
         "Authorization" : "Basic " + new Buffer(process.env.WUFOO_API_KEY + ":footastic").toString("base64")
      }
    }, callback);
  },

  /**
   * Gets an array of phone numbers from the SMS Subscribers form
   *
   * @param callback The callback function
   */
  getSmsSubscribers: function(callback) {
    wufoo.getFormEntries(process.env.WUFOO_SUBSCRIBER_FORM_ID, function(err, entries){
      if (err) {
        console.error(err);
        return callback(err);
      }

      // an oddity of WuFoo's API is that
      // param keys are lowercased when returned
      var field_phone = FIELD_PHONE.toLowerCase();
      var numbers = _.pluck(entries, field_phone);
      callback(null, numbers);
    })
  },


  /**
   * Convenience method to Wufoo's GET /form api endpoint,
   * populated for the SMS Subscriber form
   */
  getSubscriberForm: function(callback) {
    wufoo.getForm(process.env.WUFOO_SUBSCRIBER_FORM_ID, function(err, form){
      callback(err, form);
    })
  }
}