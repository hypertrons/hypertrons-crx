// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

var webpack = require('webpack'),
config = require('../webpack.config');
config.watch = true;

delete config.chromeExtensionBoilerplate;

webpack(config, function(err) {
  if (err) throw err;
});
