var cwd = process.cwd();
var selenium = require("selenium-webdriver");
var cheerio = require('cheerio')
var app = require(cwd + "/app")
var should = require('should');
var appRoot = "http://localhost:3001";
var By, br, server;

var serverModuleUrl = cwd + "/bin/www"

before(function(){
  this.timeout(10000);
  delete require.cache[require.resolve(serverModuleUrl)];
  server = require(serverModuleUrl);
  br = this.driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build()
  By = selenium.By;
  
  // this just ensures that the browser has started up
  // before returning from the before block
  return this.driver.getWindowHandle();
})

after(teardown)
process.on("uncaughtException", teardown)

describe("home page", function(){
  
  describe("elements", function(){
    before(function(){
      this.timeout(10000);
      return br.get(appRoot)
    })
    
    it("should have the title 'KCBX Wind Conditions'", function(){
      return br.getTitle().should.eventually.equal("KCBX Wind Conditions")
    })
    
    it("should have subscription form", function(){
      return br.isElementPresent({
        tagName: "form",
        className: "sms-signup"
      }).should.eventually.be.ok()
    })
  })
  
  describe("translations", function(){
    var trxBlock = this;
    before(function(done){
      this.timeout(20000)
      br.get(appRoot + "/?setLng=es-US")
      br.getPageSource()
      .then(function(bodyText){
        trxBlock.$ = cheerio.load(bodyText)
        done();
      })
      .catch(function(e){
        throw e;
      })
    })
    
    it("should not have any missing translations", function(done){
      trxBlock.$.text().should.not.match(/\w\.\w{4}/);
      done();
    })
  })
})



function teardown() {
  return br.quit();
}
