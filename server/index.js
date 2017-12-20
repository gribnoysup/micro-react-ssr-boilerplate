const { send } = require('micro');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');

const cwd = process.cwd();

const wrapMiddleware = middleware => next => (req, res) => {
  return middleware(req, res, () => next(req, res));
};

const composeMiddleware = (...middleware) => next => {
  return middleware.reduce((p, c) => wrapMiddleware(c)(p), next);
};

const compiler = webpack(webpackConfig);

const devMiddlewareConfig = {
  publicPath: '/_build/',
};

const devMiddleware = require('webpack-dev-middleware')(compiler, devMiddlewareConfig);
const hotMiddleware = require('webpack-hot-middleware')(compiler);

compiler.plugin('after-emit', (compilation, callback) => {
  for (const cachedFile in require.cache) {
    if (cachedFile.startsWith(resolve(cwd, '.build'))) {
      delete require.cache[cachedFile];
    }
  }

  callback();
});

const crateTemplate = (markup = '') => `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Test</title>
    </head>
    <body>
        <div id="app">${markup}</div>
        <script src="/_build/client.js"></script>
    </body>
</html>
`.trim();

module.exports = (req, res) => {
  composeMiddleware(devMiddleware, hotMiddleware)((req, res) => {
    const app = require('../.build/server.js');
    send(res, 200, crateTemplate());
  })(req, res);
};
