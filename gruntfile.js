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
          watch: [".", "./views/partials"],
          ignore: ['node_modules', 'bin'],
          extensions: ['js', 'hbs', 'json'],
          noRestartOn: "error",
          debug: true
        }
      }
    },

    mochaTest: {
      files: ['test/unit/**/*.js'],
      options: {
        require: 'test/bootstrap.js',
        timeout: 30000
      }
    }
  })
}

grunt.loadNpmTasks("grunt-supervisor");
grunt.loadNpmTasks('grunt-mocha-test');

grunt.registerTask('test' , ['mochaTest']);
grunt.registerTask('serve', ['supervisor']);
