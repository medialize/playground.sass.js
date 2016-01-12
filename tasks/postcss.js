module.exports = {
  options: {
    processors: [
      require('autoprefixer')()
    ]
  },
  dist: {
    src: 'dist/css/style.css',
    dest: 'dist/css/style.css'
  }
};
