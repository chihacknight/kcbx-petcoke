require("./lib/env")

var grunt = require('grunt')
  , fs = require('fs')
  ;

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
