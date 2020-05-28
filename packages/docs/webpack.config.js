const sass = require('sass');
const fiber = require('fibers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');

module.exports = {
  target: 'web',
  mode: 'production',
  entry: './src/bundle.js',
  module: {
    rules: [
      {
        test: /.s[ac]ss$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          options: {
            implementation: sass,
            sassOptions: {
              fiber,
            },
          },
        }],
      },
      {
        test: /.(png|jpe?g|webp)$/,
        loader: 'file-loader',
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/template/index.html',
    }),
    new ResourceHintWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
};
