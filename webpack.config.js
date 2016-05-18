var path = require("path");
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    src: ["./src/main.js"]
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, "build"),
    // publicPath: "/assets/",
    filename: "bundle.js"
  },
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react' , 'es2015' ]
        }
      },
      { test: /\.json$/, 
        loader: "json" 
      },
      {
        test: /\.node$/, 
        loader: "node" 
      }
    ]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.es6', '.node']
  }
};
