var cwd = process.cwd();

var evt = require(cwd + "/services/events");
var fs = require('fs');
var memjs = require('memjs');
var cache = memjs.Client.create();
var moment = require('moment');
var subscriberService = require(cwd + '/services/smsSubscriber');
var subscriberStubs = require(cwd + '/test/stubs/smsSubscriberService');
var weatherService = require(cwd + '/services/weather');
var weatherServiceStubs = require(cwd + '/test/stubs/weatherService');
var notificationsService = require(cwd + '/services/notifications');

var sixAM = moment().day(-6).startOf('day').hour(06).valueOf();
var tenAM = moment().day(-6).startOf('day').hour(10).valueOf();
var tenPM = moment().day(-6).startOf('day').hour(22).valueOf();

// since the poll script is not a module, we need to
// eval() its contents in order to run it for each test.
var pollScript = fs.readFileSync(cwd + '/bin/poll') // get contents
                 .toString()   // convert from buffer to string
                 .split("\n")  // split into lines
                 .splice(1)    // remove first line (#!/bin/node)
                 .join("\n");  // join lines back into string




describe('bin/poll script', function(){

  var clock;

  beforeEach(function(done){
    sinon.spy(notificationsService, 'broadcast');
    sinon.spy(notificationsService, 'sendMessage');
    clock = sinon.useFakeTimers(tenAM);
    sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers)
    cache.flush(done);
  })

  afterEach(function(done){
    notificationsService.broadcast.restore();
    notificationsService.sendMessage.restore();
    clock.restore();
    subscriberService.getSubscribers.restore();
    done();
  })


  it('should send notifications when windspeed exceeds hazardous threshold', function(done){
    this.timeout(10000)
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);


    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(1);
      notificationsService.sendMessage.callCount.should.eql(33);

      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })



  it('should not send notifications if windspeed does not exceed hazardous threshold', function(done){
    this.timeout(10000)
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.belowThreshold);

    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(0);
      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })


  it('should send notifications if last sent more than 6 hours ago and set new cache value', function(done){
    this.timeout(10000)
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(7, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      evt.once("pollFinished", function(){
        weatherService.getForecast.callCount.should.eql(1);
        notificationsService.broadcast.callCount.should.eql(1);
        weatherService.getForecast.restore();
        cache.get("notifications.last_wind_notice_sent", function(err, lastSent){
          var diff = moment.duration( moment(lastSent.toString()).diff(moment()) );
          diff.asSeconds().should.be.lessThan(3);
          done();
        })
      })
      eval(pollScript);

    })
  })

  it('should not send notifications if last sent less than 6 hours ago', function(done){
    this.timeout(10000)
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(5, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      evt.once("pollFinished", function(){
        weatherService.getForecast.callCount.should.eql(1);
        notificationsService.broadcast.callCount.should.eql(0);
        weatherService.getForecast.restore();
        done();
      })
      eval(pollScript);

    })
  })

  it('should not send notifications before 8am', function(done){
    this.timeout(10000)
    clock.restore();
    clock = sinon.useFakeTimers(sixAM);

    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(0);
      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })

  it('should not send notifications after 9pm', function(done){
    this.timeout(10000)
    clock.restore();
    clock = sinon.useFakeTimers(tenPM);

    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(0);
      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })

})
