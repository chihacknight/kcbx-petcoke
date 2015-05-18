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

// since the poll script is not a module, we need to
// eval() its contents in order to run it for each test.
var pollScript = fs.readFileSync(cwd + '/bin/poll') // get contents
                 .toString()   // convert from buffer to string
                 .split("\n")  // split into lines
                 .splice(1)    // remove first line (#!/bin/node)
                 .join("\n");  // join lines back into string




describe('bin/poll script', function(){

  var spyBroadcast;

  beforeEach(function(done){
    spyBroadcast = sinon.spy(notificationsService, 'broadcast');
    sinon.stub(subscriberService, 'getSubscribers', subscriberStubs.getSubscribers)
    sinon.stub(moment, 'hour', function(){ return 10; })
    cache.flush(done);
  })

  afterEach(function(done){
    spyBroadcast.restore();
    subscriberService.getSubscribers.restore();
    moment.hour.restore();
    done();
  })


  it('should send notifications when windspeed exceeds hazardous threshold', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);


    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      spyBroadcast.callCount.should.eql(1);
      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })



  it('should not send notifications if windspeed does not exceed hazardous threshold', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.belowThreshold);


    evt.once("pollFinished", function(){
      weatherService.getForecast.callCount.should.eql(1);
      spyBroadcast.callCount.should.eql(0);
      weatherService.getForecast.restore();
      done();
    })
    eval(pollScript);
  })


  it('should send notifications if last sent more than 6 hours ago and set new cache value', function(done){
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(7, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      evt.once("pollFinished", function(){
        weatherService.getForecast.callCount.should.eql(1);
        spyBroadcast.callCount.should.eql(1);
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
    sinon.stub(weatherService, 'getForecast', weatherServiceStubs.getForecast.aboveThreshold);
    var sent = moment().subtract(5, 'hours').format()
    cache.set('notifications.last_wind_notice_sent', sent, function(err){
      if (err) throw err;

      evt.once("pollFinished", function(){
        weatherService.getForecast.callCount.should.eql(1);
        spyBroadcast.callCount.should.eql(0);
        weatherService.getForecast.restore();
        done();
      })
      eval(pollScript);

    })
  })


})
