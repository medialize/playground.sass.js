module.exports = {
  html: {
    files: 'playground.html',
    options: {
      livereload: true
    }
  },
  css: {
    files: 'assets/css/**/*.scss',
    tasks: ['sass'],
    options: {
      livereload: true
    }
  },
  config: {
    files: [
      'Gruntfile.js',
      'tasks/*js'
    ],
    options: {
      reload: true
    }
  }
};
