var webpack = require('webpack');

module.exports = {
  dist: {
    entry: './source/js/index.js',
    output: {
      path: './dist/js',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }
};
