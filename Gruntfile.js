module.exports = function (grunt) {
  // require grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var configs = require('load-grunt-configs')(grunt, {
    config : {
      src: 'tasks/*.js'
    }
  });
  grunt.initConfig(configs);

  grunt.registerTask('build', ['sass:dev', 'autoprefixer:dev']);
  grunt.registerTask('default', ['build']);
}
