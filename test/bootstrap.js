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
global.cwd = process.cwd();
global.cheerio = require('cheerio')
global.selenium = require("selenium-webdriver");
  global.By = selenium.By;
global.should = require('should');
global.sinon = require('sinon');

global.testConfig = require("./helpers/config.json");
global.testServer = require("./helpers/server");

before(function(){
  this.timeout(10000);
  global.chromeDriver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build()
  
  // this just ensures that the browser has started up
  // before returning from the before block
  return chromeDriver.getWindowHandle();
})

after(function(done){
  teardown(done);
})
process.on("uncaughtException", function(){
  teardown();
})


function teardown(done) {
  done = done || function(){}
  chromeDriver.quit().then(function(){
    testServer.close(done);
  });
}
