var cwd = process.cwd();

var fs = require('fs');
var memjs = require('memjs');
var cache = memjs.Client.create();
var moment = require('moment');
var subscriberService = require(cwd + '/services/smsSubscriber');
var subscriberStubs = require(cwd + '/test/stubs/smsSubscriberService');
var weatherService = require(cwd + '/services/weather');
var weatherServiceStubs = require(cwd + '/test/stubs/weatherService');
var notificationsService = require(cwd + '/services/notifications');

// since the poll script is not a module, we need to
// eval() its contents in order to run it for each test.
var pollScript = fs.readFileSync(cwd + '/bin/poll') // get contents
                 .toString()   // convert from buffer to string
                 .split("\n")  // split into lines
                 .splice(1)    // remove first line (#!/bin/node)
                 .join("\n");  // join lines back into string




describe('bin/poll script', function(){

  beforeEach(function(done){
    sinon.stub(notificationsService, 'broadcast');
    sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers)
    cache.flush(done);
  })

  afterEach(function(done){
    notificationsService.broadcast.restore();
    subscriberService.getSubscribers.restore();
    done();
  })


  it('should send notifications when windspeed exceeds hazardous threshold', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);

    eval(pollScript);

    // this is a little bit of a hack to wait for
    // the poll script to finish its asynchronous
    // functions.
    setTimeout(function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(1);
      weatherService.getForecast.restore();
      done();
    }, 100)
  })



  it('should not send notifications if windspeed does not exceed hazardous threshold', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.belowThreshold);

    eval(pollScript);

    setTimeout(function(){
      weatherService.getForecast.callCount.should.eql(1);
      notificationsService.broadcast.callCount.should.eql(0);
      weatherService.getForecast.restore();
      done();
    }, 100)
  })


  it('should send notifications if last sent more than 6 hours ago', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(7, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      eval(pollScript);

      setTimeout(function(){
        weatherService.getForecast.callCount.should.eql(1);
        notificationsService.broadcast.callCount.should.eql(1);
        weatherService.getForecast.restore();
        done();
      }, 100)

    })
  })

  it('should not send notifications if last sent less than 6 hours ago', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(5, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      eval(pollScript);

      setTimeout(function(){
        weatherService.getForecast.callCount.should.eql(1);
        notificationsService.broadcast.callCount.should.eql(0);
        weatherService.getForecast.restore();
        done();
      }, 100)

    })
  })


})
