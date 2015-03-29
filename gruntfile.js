require("./lib/env")

var grunt = require('grunt')
  , fs = require('fs')
  ;

module.exports = function(grunt) {
  grunt.initConfig({
    supervisor: {
      target: {
        script: "bin/www",
        options: {
          ignore: ['node_modules', 'bin'],
          noRestartOn: "error",
          debug: true
        }
      }
    }
  })
}

grunt.loadNpmTasks("grunt-supervisor")


grunt.registerTask('serve', ['supervisor'])