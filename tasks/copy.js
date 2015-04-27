module.exports = {
  fonts: {
    expand: true,
    cwd: 'source/fonts',
    src: '**',
    dest: 'dist/fonts'
  },
  sassjs: {
    expand: true,
    cwd: 'node_modules/sass.js/dist/',
    src: '**',
    dest: 'dist/js/sass.js'
  },
  ace: {
    expand: true,
    cwd: 'source/js/ace',
    src: '**',
    dest: 'dist/js/ace'
  }
};
