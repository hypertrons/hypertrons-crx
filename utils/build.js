var env = require('./env');
var webpack = require('webpack');
var config = require('../webpack.config');

if (env.NODE_ENV === 'development') {
  config.watch = true;
}
delete config.chromeExtensionBoilerplate;

webpack(config, function (err) {
  if (err) throw err;
});
