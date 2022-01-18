var webpack = require('webpack'),
path = require('path'),
fileSystem = require('fs-extra'),
ENV = require('./utils/env'),
{ CleanWebpackPlugin } = require('clean-webpack-plugin'),
CopyWebpackPlugin = require('copy-webpack-plugin'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
WriteFilePlugin = require('write-file-webpack-plugin'),
CrxWebpackPlugin = require("crx-webpack-plugin");

// load the secrets
var alias = {
  'react-dom': '@hot-loader/react-dom',
};

var secretsPath = path.join(__dirname, 'secrets.' + ENV.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var content_security_policy;
if(ENV.NODE_ENV === 'development'){
  content_security_policy="script-src 'self' 'unsafe-eval'; object-src 'self'"
}
else{
  content_security_policy="script-src 'self'; object-src 'self'"
}

var options = {
  mode: ENV.NODE_ENV,
  entry: {
    options: path.join(__dirname, 'src', 'pages', 'Options', 'index.tsx'),
    popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.tsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.ts'),
    contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        sideEffects: true,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.jsx', '.js', '.ts', '.tsx', '.css']),
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV', 'MOCK']),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
                content_security_policy: content_security_policy,
              })
            );
          },
        },
      ],
      {
        logLevel: 'info',
        copyUnmodified: true,
      }
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/content.styles.css',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
      {
        logLevel: 'info',
        copyUnmodified: true,
      }
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/assets/img/',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
      {
        logLevel: 'info',
        copyUnmodified: true,
      }
    ),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WriteFilePlugin(),
    new CrxWebpackPlugin({
      keyFile: 'build.pem',
      contentPath: 'build',
      outputPath: 'release',
      name: 'hypercrx',
    }),
  ],
  node: {
    fs: 'empty',
  },
};

if (ENV.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
