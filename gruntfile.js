require("./lib/env")

var grunt = require('grunt')
  , fs = require('fs')
  ;

module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      dist: {
        files: {
          "public/stylesheets/style.css" : "sass/main.scss"
        }
      }
    },
      
    nodemon: {
      target: {
        script: "bin/www",
        options: {
          ext: "hbs,js,json",
          ignore: ['node_modules/**'],
        }
      }
    },
    
    watch: {
      sass: {
        files: ["sass/**/*"],
        tasks: ["sass"]
      }
    },

    mochaTest: {
      files: [
        'test/bootstrap.js',
        'test/**/*.test.js'
      ],
      options: {
        timeout: 30000
      }
    }
  })
}

grunt.loadNpmTasks("grunt-nodemon");
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('test' , ['mochaTest']);
grunt.registerTask('serve', ['nodemon', 'watch']);
