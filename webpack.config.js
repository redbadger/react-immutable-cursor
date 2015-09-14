const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: ['./src/react-immutable-cursor.js'],
  output: {
    filename: 'react-immutable-cursor.min.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  externals: {
    // We'll eventually include immutable-js here too, however, until
    // https://github.com/facebook/immutable-js/pull/622 is accepted, we need to
    // package it in this bundle.
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
