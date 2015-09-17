const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/react-immutable-cursor.js'],
  output: {
    filename: 'react-immutable-cursor.min.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'var',
  },
  externals: {
    'immutable': 'immutable',
    'react': 'react'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};
