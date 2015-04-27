var _ = require('lodash');

process.env.NODE_ENV            = 'test';
process.env.USE_TEST_RECIPIENT  = false;
process.env.TEST_POLL_SCRIPT    = false;

global.should = require('should');
global.sinon = require('sinon');
