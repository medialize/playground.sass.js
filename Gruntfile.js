module.exports = function (grunt) {
  // require grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-gh-pages');

  var configs = require('load-grunt-configs')(grunt, {
    config: {
      src: 'tasks/*.js'
    }
  });
  grunt.initConfig(configs);

  grunt.registerTask('html', ['htmlmin']);
  grunt.registerTask('css', ['sass:dev', 'autoprefixer:dev']);
  grunt.registerTask('js', ['concat', 'copy']);

  grunt.registerTask('build', ['html', 'css', 'js']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);

  grunt.registerTask('default', ['build']);
}
