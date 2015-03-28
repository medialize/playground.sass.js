module.exports = {
  html: {
    files: 'source/*.html',
    tasks: ['html'],
    options: {
      livereload: true
    }
  },
  scss: {
    files: 'source/scss/**/*.scss',
    tasks: ['css'],
    options: {
      livereload: true
    }
  },
  js: {
    files: 'source/js/**/*.js',
    tasks: ['js'],
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
