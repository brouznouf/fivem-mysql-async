const sass = require('sass');
const fiber = require('fibers');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const docsConfig = {
  entry: './docs/docs.js',
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, './docs/dist'),
  },
  optimization: {
    minimize: true,
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
        test: /\.(png|webp|jpeg)(\?.*)?$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '.',
          },
        }],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './docs/template/index.html',
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
      '@': path.resolve('docs'),
    },
  },
};

module.exports = docsConfig;
