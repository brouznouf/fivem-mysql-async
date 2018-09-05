const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'ghmattimysql.js',
    path: path.resolve(__dirname, 'dist/ghmattimysql'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static' },
    ]),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [[
            '@babel/preset-env',
            {
              targets: {
                chrome: 68,
              },
            },
          ]],
          comments: false,
          compact: true,
        },
      },
    }],
  },
};
