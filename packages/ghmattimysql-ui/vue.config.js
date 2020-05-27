module.exports = {
  publicPath: './',
  outputDir: '../../dist/ghmattimysql/ui',
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks');
    config.externals({
      moment: 'moment',
    });
  },
  transpileDependencies: [
    'vuetify',
  ],
};
