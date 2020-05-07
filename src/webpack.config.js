const sass = require('sass');
const fiber = require('fibers');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const serverConfig = {
  entry: './entry/server.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'mysql-async.js',
    path: path.resolve(__dirname, '..'),
  },
  optimization: {
    minimize: false,
  },
};

const clientConfig = {
  entry: './entry/client.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'mysql-async-client.js',
    path: path.resolve(__dirname, '..'),
  },
  optimization: {
    minimize: false,
  },
};

const nuiConfig = {
  entry: './entry/nui.js',
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../ui'),
  },
  optimization: {
    minimize: true,
  },
  externals: {
    moment: 'moment',
  },
  stats: {
    children: false,
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.sass$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            implementation: sass,
            sassOptions: {
              fiber,
            },
            prependData: '@import \'@/styles/variables.scss\'',
          },
        }],
      },
      {
        test: /\.scss$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'sass-loader',
          // Requires sass-loader@^8.0.0
          options: {
            implementation: sass,
            sassOptions: {
              fiber,
            },
            prependData: '@import \'@/styles/variables.scss\';',
          },
        }],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: './fonts',
          },
        }],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './template/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCssnanoPlugin({
      sourceMap: false,
      cssnanoOptions: {
        preset: ['default', {
          mergeLonghand: false,
          cssDeclarationSorter: false,
        }],
      },
    }),
    new VuetifyLoaderPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve('ui'),
    },
  },
};

module.exports = [serverConfig, clientConfig, nuiConfig];
