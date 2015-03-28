module.exports = {
  html: {
    files: '*.html',
    options: {
      livereload: true
    }
  },
  css: {
    files: 'assets/css/**/*.scss',
    tasks: ['sass', 'autoprefixer'],
    options: {
      livereload: true
    }
  },
  js: {
    files: 'assets/js/**/*.js',
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
