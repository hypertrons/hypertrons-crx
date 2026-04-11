import fs from 'fs';
import { join } from 'path';
import mkdirp from 'mkdirp';
import ChromeExtension from 'crx';

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
  this.keyFile = this.options.keyFile;
  this.outputPath = this.options.outputPath;
  this.contentPath = this.options.contentPath;

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
  return compiler.hooks.done.tapPromise('crx-webpack-plugin', async function () {
    await self.package.call(self);
  });
};

// package the extension
CrxWebpackPlugin.prototype.package = function () {
  var self = this;
  var manifestPath = join(self.contentPath, 'manifest.json');
  var sourceManifestPath = join(self.contentPath, '..', 'src', 'manifest.json');
  var packageJsonPath = join(self.contentPath, '..', 'package.json');

  return (async function () {
    if (!fs.existsSync(manifestPath)) {
      if (!fs.existsSync(sourceManifestPath) || !fs.existsSync(packageJsonPath)) {
        throw new Error('Cannot package extension because build artifact is missing: ' + manifestPath);
      }

      const sourceManifest = JSON.parse(await fs.promises.readFile(sourceManifestPath, 'utf8'));
      const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));

      const generatedManifest = {
        description: packageJson.description,
        version: packageJson.version,
        ...sourceManifest,
      };

      await mkdirp(self.contentPath);
      await fs.promises.writeFile(manifestPath, JSON.stringify(generatedManifest));
      self.logger.warn('manifest.json was missing in build output; generated fallback manifest for packaging');
    }

    await self.crx.load(self.contentPath);
    var buffer = await self.crx.pack();
    await mkdirp(self.outputPath);

    var updateXML = self.crx.generateUpdateXML();
    await fs.promises.writeFile(self.updateFile, updateXML);
    self.logger.info('wrote updateFile to ' + self.updateFile);

    await fs.promises.writeFile(self.crxFile, buffer);
    self.logger.info('wrote crxFile to ' + self.crxFile);
  })().catch((err) => {
    self.logger.error(err);
    throw err;
  });
};

export default CrxWebpackPlugin;
