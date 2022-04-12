var fs = require('fs');
var path = require('path');
var join = path.join;
var mkdirp = require('mkdirp');
var ChromeExtension = require('crx');

function CrxWebpackPlugin(options) {
  this.options = options || {};
  if (!this.options.updateUrl) {
    this.options.updateUrl = 'http://localhost:8000/';
  }
  if (!this.options.updateFilename) {
    this.options.updateFilename = 'updates.xml';
  }

  // remove trailing slash
  this.options.updateUrl = this.options.updateUrl.replace(/\/$/, '');

  // setup paths
  this.context = path.dirname(module.parent.filename);
  this.keyFile = path.isAbsolute(this.options.keyFile)
    ? this.options.keyFile
    : join(this.context, this.options.keyFile);
  this.outputPath = path.isAbsolute(this.options.outputPath)
    ? this.options.outputPath
    : join(this.context, this.options.outputPath);
  this.contentPath = path.isAbsolute(this.options.contentPath)
    ? this.options.contentPath
    : join(this.context, this.options.contentPath);

  // set output info
  this.crxName = this.options.name + '.crx';
  this.crxFile = join(this.outputPath, this.crxName);
  this.updateFile = join(this.outputPath, this.options.updateFilename);
  this.updateUrl = this.options.updateUrl + '/' + this.options.updateFilename;

  // initiate crx
  this.crx = new ChromeExtension({
    privateKey: fs.readFileSync(this.keyFile),
    codebase: this.options.updateUrl + '/' + this.crxName,
  });
}

// hook into webpack
CrxWebpackPlugin.prototype.apply = function (compiler) {
  var self = this;
  self.logger = compiler.getInfrastructureLogger('crx-webpack-plugin');
  return compiler.hooks.done.tap('crx-webpack-plugin', function () {
    self.package.call(self);
  });
};

// package the extension
CrxWebpackPlugin.prototype.package = function () {
  var self = this;
  self.crx.load(self.contentPath).then(function () {
    self.crx.pack().then(function (buffer) {
      mkdirp(self.outputPath)
        .then((made) => {
          var updateXML = self.crx.generateUpdateXML();
          fs.writeFile(self.updateFile, updateXML, function (err) {
            if (err) {
              self.logger.error(err);
              throw err;
            }
            self.logger.info('wrote updateFile to ' + self.updateFile);
            fs.writeFile(self.crxFile, buffer, function (err) {
              if (err) {
                self.logger.error(err);
                throw err;
              }
              self.logger.info('wrote crxFile to ' + self.crxFile);
            });
          });
        })
        .catch((err) => {
          self.logger.error(err);
          throw err;
        });
    });
  });
};

module.exports = CrxWebpackPlugin;
