const { resolve } = require('path');

const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');

const createCommonConfig = ({ output } = {}) => ({
  context: process.cwd(),

  output: {
    path: resolve(__dirname, '../.build'),
    filename: '[name].js',
    publicPath: '/_build/',
    strictModuleExceptionHandling: true,
    ...(typeof output === 'object' ? output : {}),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
});

module.exports = [
  {
    ...createCommonConfig(),

    name: 'client',

    entry: {
      client: [
        'webpack-hot-middleware/client?timeout=20000&overlay=false&reload=false&name=client',
        resolve(__dirname, '../client/client.js'),
      ],
    },

    plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.HotModuleReplacementPlugin()],
  },
  {
    ...createCommonConfig({
      output: { libraryTarget: 'commonjs2' },
    }),

    name: 'server',

    entry: {
      server: [resolve(__dirname, '../client/server.js')],
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new WriteFilePlugin({
        test: /\.js$/,
        exitOnErrors: false,
        useHashIndex: false,
      }),
    ],
  },
];
