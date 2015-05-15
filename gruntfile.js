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
          debug: true,
          extensions: ['node', 'js', 'json']
        }
      }
    },

    mochaTest: {
      files: ['test/unit/**/*.js'],
      options: {
        require: 'test/bootstrap.js'
      }
    }
  })
}

grunt.loadNpmTasks("grunt-supervisor");
grunt.loadNpmTasks('grunt-mocha-test');

grunt.registerTask('test' , ['mochaTest']);
grunt.registerTask('serve', ['supervisor']);
