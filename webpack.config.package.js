const nodeExternals = require('webpack-node-externals');

const path = require('path');
const fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});
// to transpile all source code from es6 to es5 and build a single source file
export default {
	entry: './src/main.js',
	output: {
		path: __dirname + '/dist/build',
		filename: 'build.js'
	},
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  externals: [nodeExternals()],
  target: 'electron'
};
