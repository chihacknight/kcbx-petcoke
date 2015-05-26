var cwd = process.cwd();
require(cwd + "/lib/env")
var _ = require('lodash');

process.env.NODE_ENV            = 'test';
process.env.USE_TEST_RECIPIENT  = false;
process.env.TEST_POLL_SCRIPT    = false;

process.env.TWILIO_ACCOUNT_SID  = process.env.TWILIO_TEST_ACCOUNT_SID;
process.env.TWILIO_AUTH_TOKEN   = process.env.TWILIO_TEST_AUTH_TOKEN;
process.env.TWILIO_FROM_NUMBER  = process.env.TWILIO_TEST_FROM_NUMBER;

global._ = require('lodash')
global.should = require('should');
global.sinon = require('sinon');
