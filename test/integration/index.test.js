var subscriberService = require(cwd + '/services/smsSubscriber');
var subscriberStubs = require(cwd + '/test/stubs/smsSubscriberService');
var weatherService = require(cwd + '/services/weather');
var weatherServiceStubs = require(cwd + '/test/stubs/weatherService');

var appRoot = testConfig.appRootUrl;
var enQuery = testConfig.enQuery;
var esQuery = testConfig.esQuery;
var serverModuleUrl = cwd + testConfig.serverModuleUrl
var chr;



describe("home page", function(){

  before(function(done){
    this.timeout(10000);
    chr = chromeDriver;
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.belowThreshold)
    testServer.reset(done);
  })

  after(function(done){
    weatherService.getForecast.restore();
    done();
  })

  
  describe("elements", function(){
    before(function(){
      this.timeout(10000);
      return chr.get(appRoot)
    })
    
    it("should have the title 'KCBX Wind Conditions'", function(){
      return chr.getTitle().should.eventually.equal("KCBX Wind Conditions")
    })
    
    it("should have subscription form", function(){
      return chr.isElementPresent({
        tagName: "form",
        className: "sms-signup"
      }).should.eventually.be.ok()
    })
  })
  
  describe("subscription form", function(){
    
    describe("subscribes with new number", function(){
      before(function(){
        process.env.USE_TEST_RECIPIENT = true;
        sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers);
        sinon.spy(subscriberService, 'addSubscriber');
        chr.get(`${appRoot}?${enQuery}`);
        chr.findElement(By.id("phone_input")).sendKeys("847.644.9168");
        return chr.findElement(By.name("submit")).click()
      })
      
      it("should make a call to smsSubcriberService.addSubscriber", function(done){
        subscriberService.addSubscriber.callCount.should.eql(1);
        done();
      });
      
      it("should show 'Thank You' in status block", function(){
        return chr.isElementPresent(By.xpath("//div[contains(text(),'Thank you')]")).should.eventually.be.ok();
      });
      
      after(function(done){
        process.env.USE_TEST_RECIPIENT = false;
        subscriberService.getSubscribers.restore();
        subscriberService.addSubscriber.restore();
        done();
      })
    })
    
    describe("subscribes with duplicate number", function(){
      before(function(){
        sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers);
        sinon.spy(subscriberService, 'addSubscriber');
        chr.get(`${appRoot}?${enQuery}`);
        chr.findElement(By.id("phone_input")).sendKeys("312.555.5555");
        return chr.findElement(By.name("submit")).click()
      })
      
      it("should make a call to smsSubcriberService.addSubscriber", function(done){
        subscriberService.addSubscriber.callCount.should.eql(1);
        done();
      });
      
      it("should show 'Already Subscribed' in status block", function(){
        return chr.isElementPresent(By.xpath("//div[contains(text(),'is already subscribed')]")).should.eventually.be.ok();
      });
    
      after(function(done){
        process.env.USE_TEST_RECIPIENT = false;
        subscriberService.getSubscribers.restore();
        subscriberService.addSubscriber.restore();
        done();
      })
    })
    
    describe("subscribes with malformed number", function(){
      before(function(){
        sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers);
        sinon.spy(subscriberService, 'addSubscriber');
        chr.get(`${appRoot}?${enQuery}`);
        chr.findElement(By.id("phone_input")).sendKeys("312.555.555");
        return chr.findElement(By.name("submit")).click()
      })
      
      it("should make a call to smsSubcriberService.addSubscriber", function(done){
        subscriberService.addSubscriber.callCount.should.eql(1);
        done();
      });
      
      it("should show 'Bad Number' in status block", function(){
        return chr.isElementPresent(By.xpath("//div[contains(text(),'Please provide a valid 10-digit')]")).should.eventually.be.ok();
      });
    
      after(function(done){
        process.env.USE_TEST_RECIPIENT = false;
        subscriberService.getSubscribers.restore();
        subscriberService.addSubscriber.restore();
        done();
      })
    })
  })
  
  describe("translations", function(){
    var trxBlock = this;
    before(function(done){
      this.timeout(20000)
      chr.get(`${appRoot}?${esQuery}`)
      chr.getPageSource()
      .then(function(bodyText){
        trxBlock.$ = cheerio.load(bodyText)
        done();
      })
      .catch(function(e){
        throw e;
      })
    })
    
    // Can't think of a way to test this. Tried the regex \w\.\w{4}, 
    // but the google analytics code matched it
    it("should not have any missing translations")
  })
})
