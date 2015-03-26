var grunt = require('grunt')
  , fs = require('fs')
  ;

if (fs.existsSync("./lib/_ENV.js")) {
  require("./lib/_ENV");
}

console.log(process.env.DATABASE_URL)
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-db-migrate');

  grunt.initConfig({
    migrate: {
      env: {
        DATABASE_URL: process.env.DATABASE_URL
      },
      verbose: true
    }
  })

  grunt.registerTask("test", function(){
    console.log('foo')
  })
}