const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const modules = {
  rules: [
    {
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
    },
    {
      test: /\.vue$/,
      use: 'vue-loader',
    },
    {
      test: /\.css$/,
      loader: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.styl(us)?$/,
      loader: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './fonts',
          publicPath: './fonts',
        },
      }],
    },
  ],
};

const serverConfig = {
  entry: './src/entry/server.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'ghmattimysql-server.js',
    path: path.resolve(__dirname, 'dist/ghmattimysql'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static/ghmattimysql.lua', to: '__resource.lua' },
      { from: 'src/static/ghmattimysql-server.lua', to: 'ghmattimysql-server.lua' },
      { from: 'src/static/config.json', to: 'config.json' },
    ]),
  ],
  module: modules,
};

/* const testConfig = {
  entry: './src/entry/test.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'test-server.js',
    path: path.resolve(__dirname, 'dist/ghmattimysql-test'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static/ghmattimysql-test.lua', to: '__resource.lua' },
    ]),
  ],
  module: modules,
}; */

const clientConfig = {
  entry: './src/entry/client.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'ghmattimysql-client.js',
    path: path.resolve(__dirname, 'dist/ghmattimysql'),
  },
  optimization: {
    minimize: true,
  },
  module: modules,
};

const nuiConfig = {
  entry: './src/entry/nui.js',
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist/ghmattimysql/ui'),
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
  module: modules,
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/ui/template/index.html',
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
};

module.exports = [
  serverConfig, clientConfig, nuiConfig, // testConfig,
];
