var _ = require('lodash')

process.env = _.defaults(process.env, {
  NODE_ENV            : "development",
  DATABASE_URL        : "postgres://postgres:postgres@localhost:5432",
  
  // Get a free account and API key at https://developer.forecast.io/
  FORECAST_IO_API_KEY : "<your api key here>",

  // You can get test credentials for twilio without activiting
  // an actual number. More info here:
  // https://www.twilio.com/docs/api/rest/test-credentials
  TWILIO_ACCOUNT_SID  : "<your creds here>",
  TWILIO_AUTH_TOKEN   : "<your creds here>",
  TWILIO_FROM_NUMBER  : "XXXXXXXXXX",

  USE_TEST_RECIPIENT  : true,
  TEST_RECIPIENT      : "XXXXXXXXXX",

  // set this to 'true' to send notifications on all runs of bin/poll, 
  // regardless of whether windspeed exceeds threshold
  TEST_POLL_SCRIPT    : true,

  // These are for connecting the application to the google fusion table that
  // stores subscriber data. If you set the USE_TEST_RECIPIENT variable above
  // to `true`, then the smsSubscriber service will simply stub its methods in
  // development and you don't need to use this
  GOOGLE_FUSION_TABLE_ID : '<yours here>',
  GOOGLE_ACCOUNT_EMAIL   : '<yours here>',
  GOOGLE_AUTH_EMAIL      : '<yours here>',
  GOOGLE_AUTH_CLIENT_ID  : '<yours here>',
  GOOGLE_AUTH_PEM        : '<yours here>'

})
