process.env.NODE_ENV = process.env.NODE_ENV || 'test';
var cwd = process.cwd();

var config = require(`${cwd}/test/helpers/config.json`)
var serverModuleUrl = cwd + config.serverModuleUrl;
var server = require(serverModuleUrl);

module.exports = {
  get: function() {
    return server;
  },
  
  reset: function(done) {
    server.close(function(err){
      if (err) throw err;
      delete require.cache[require.resolve(serverModuleUrl)];
      server = require(serverModuleUrl);
      return done(null, server);      
    })
  },
  
  close: function(done) {
    return server.close(done);
  }
}
