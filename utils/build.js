import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import CrxWebpackPlugin from './crx-webpack-plugin/index.js';
import webpack from 'webpack';
import config from '../webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
