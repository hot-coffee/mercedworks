module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          optimization: 2
        },
        files: {
          "./public/stylesheets/main.css": "./public/stylesheets/main.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['./public/stylesheets/**/*.less'], // which files to watch
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'watch']);
};