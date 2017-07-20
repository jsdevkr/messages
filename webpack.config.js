require('babel-polyfill');

var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');


const devBuild = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: _.compact([
    new webpack.NoEmitOnErrorsPlugin(),
    devBuild ? null : new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]),

  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
    alias: {
      'react-chatview': path.join(__dirname, 'vendor/react-chatview/src/react-chatview'),
    }
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: [path.join(__dirname, 'src'), path.join(__dirname, 'vendor')] },
      { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      { test: require.resolve('moment'), use: ['expose-loader?moment'] },
      { test: /node_modules\/react-cursor/, use: ['babel-loader'] }
    ]
  },

  devtool: devBuild ? 'eval-cheap-module-source-map' : undefined
};
