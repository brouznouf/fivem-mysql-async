const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = {
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
};

const serverConfig = {
  entry: './src/entry/server.ts',
  output: {
    filename: 'ghmattimysql-server.js',
    path: path.resolve(__dirname, '../../dist/ghmattimysql'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ecma: 2017,
        mangle: false,
      },
    })],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/static/*', to: '.', flatten: true },
      ],
    }),
  ],
  ...baseConfig,
};

const clientConfig = {
  entry: './src/entry/client.ts',
  output: {
    filename: 'ghmattimysql-client.js',
    path: path.resolve(__dirname, '../../dist/ghmattimysql'),
  },
  ...baseConfig,
};

module.exports = [ serverConfig, clientConfig ];
