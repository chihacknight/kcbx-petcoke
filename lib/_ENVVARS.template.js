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

  // Phone number(s) to use for testing notifications in development
  TEST_RECIPIENTS     : 'XXXXXXXXXX'
})
