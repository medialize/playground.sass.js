var path = require('path');
var pkg = require(path.join(process.cwd(), 'node_modules/sass.js/dist/versions.json'));

module.exports = {
  versions: {
    options: {
      variables: pkg,
      prefix: '@@'
    },
    files: [{
      src: ['source/index.html'],
      dest: 'dist/',
      expand: true,
      flatten: true
    }]
  }
};
