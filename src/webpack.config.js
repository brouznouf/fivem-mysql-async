const path = require('path');

const serverConfig = {
  entry: './main.js',
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
  entry: './client.js',
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

module.exports = [serverConfig, clientConfig];
