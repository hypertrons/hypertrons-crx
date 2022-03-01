// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const path = require('path');
const CrxWebpackPlugin = require('./crx-webpack-plugin/index');

var webpack = require('webpack'),
  config = require('../webpack.config');

delete config.custom;

config.plugins.push(
  new CrxWebpackPlugin({
    keyFile: path.resolve(__dirname, '../build.pem'),
    contentPath: path.resolve(__dirname, '../build'),
    outputPath: path.resolve(__dirname, '../release'),
    name: 'hypercrx',
  })
);

config.mode = 'production';

webpack(config, function (err) {
  if (err) throw err;
});
