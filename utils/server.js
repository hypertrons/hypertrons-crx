import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from '../webpack.config.js';
import env from './env.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { debounce } from 'lodash-es';
import SSEStream from 'ssestream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const customOptions = config.custom;

for (let entryName in config.entry) {
  if (customOptions.notHMR.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      'webpack/hot/dev-server.js',
      `webpack-dev-server/client/index.js?hot=true&hostname=localhost&port=${env.PORT}`,
    ].concat(config.entry[entryName]);
  }
}
if (customOptions.enableBackgroundAutoReload || customOptions.enableContentScriptsAutoReload) {
  config.entry['background'] = [
    path.resolve(__dirname, `autoReloadClients/backgroundClient.js?port=${env.PORT}`),
  ].concat(config.entry['background']);
}
if (customOptions.enableContentScriptsAutoReload) {
  config.entry['contentScript'] = [path.resolve(__dirname, 'autoReloadClients/contentScriptClient.js')].concat(
    config.entry['contentScript']
  );
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

delete config.custom;

const compiler = webpack(config);

const server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    compress: false, // if set true, server-sent events will not work!
    host: 'localhost',
    port: env.PORT,
    static: {
      directory: path.join(__dirname, '../build'),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: 'all',
    // the following option really matters!
    setupMiddlewares: (middlewares, devServer) => {
      // if auto-reload is not needed, this middleware is not needed.
      if (!customOptions.enableBackgroundAutoReload && !customOptions.enableContentScriptsAutoReload) {
        return middlewares;
      }

      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // imagine you are using app.use(path, middleware) in express.
      // in fact, devServer is an express server.
      middlewares.push({
        path: '/__server_sent_events__', // you can find this path requested by backgroundClient.js.
        middleware: (req, res) => {
          const sseStream = new SSEStream(req);
          sseStream.pipe(res);

          sseStream.write('message from webserver.');

          let closed = false;

          const compileDoneHook = debounce((stats) => {
            const { modules } = stats.toJson({ all: false, modules: true });
            const updatedJsModules = modules.filter(
              (module) =>
                (module.type === 'module' && module.moduleType === 'javascript/auto') || module.moduleType === 'json'
            );

            const isBackgroundUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(path.resolve(__dirname, '../src/pages/Background'))
            );
            const isContentScriptsUpdated = updatedJsModules.some((module) =>
              module.nameForCondition.startsWith(path.resolve(__dirname, '../src'))
            );

            const shouldBackgroundReload =
              !stats.hasErrors() && isBackgroundUpdated && customOptions.enableBackgroundAutoReload;
            const shouldContentScriptsReload =
              !stats.hasErrors() && isContentScriptsUpdated && customOptions.enableContentScriptsAutoReload;

            if (shouldBackgroundReload) {
              sseStream.write(
                {
                  event: 'background-updated',
                  data: {}, // "data" key should be reserved though it is empty.
                },
                'utf-8'
              );
            }
            if (shouldContentScriptsReload) {
              sseStream.write(
                {
                  event: 'content-scripts-updated',
                  data: {},
                },
                'utf-8'
              );
            }
          }, 1000);

          const plugin = (stats) => {
            if (!closed) {
              compileDoneHook(stats);
            }
          };

          // a mini webpack plugin just born!
          // this plugin will be triggered after each compilation done.
          compiler.hooks.done.tap('extension-auto-reload-plugin', plugin);

          res.on('close', () => {
            closed = true;
            sseStream.unpipe(res);
          });
        },
      });

      return middlewares;
    },
  },
  compiler
);

(async () => {
  await server.start();
})();
