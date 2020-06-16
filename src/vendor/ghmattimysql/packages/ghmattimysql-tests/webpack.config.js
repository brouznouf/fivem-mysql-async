const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const cfg = {
  entry: './src/entry-server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../../dist/ghmattimysql-test'),
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
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/static/*', to: '.', flatten: true },
      ],
    }),
  ],
};


module.exports = cfg;
