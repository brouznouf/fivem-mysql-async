module.exports = {
  publicPath: './',
  outputDir: '../ui',
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks');
    config.externals({
      moment: 'moment',
    });
  },
};
