var fs = require('fs')
  , cwd = process.cwd()
  , _ = require('lodash')
  ;

if (fs.existsSync(cwd + "/lib/_ENVVARS.js")) {
  var envVars = require(cwd + "/lib/_ENVVARS")
}

_.defaults(process.env, envVars);
