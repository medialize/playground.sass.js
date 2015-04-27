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
    cwd: 'node_modules/ace-builds/src-min/',
    src: '**',
    dest: 'dist/js/ace'
  }
};
