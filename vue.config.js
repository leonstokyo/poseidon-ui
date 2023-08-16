const name = 'Selene Admin';
const path = require('path');
const webpack = require('webpack');
const timestamp = new Date().getTime();
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  //publicPath: process.env.NODE_ENV === 'production' ? '/vue/project_wokring/' : '/', // 部署应用包时的基本URL(这里可以看一下官方说明)
  publicPath: '/',
  outputDir: 'dist', // 打包时生成的生产环境构建稳健的目录
  assetsDir: 'static', // 放置生成的静态资源的目录
  filenameHashing: true,
  lintOnSave: true, // eslint-loader会将lint错误输出为编译警告
  productionSourceMap: false, // 如果你不需要生产环境的source map，可以将其设置为false，以加速生产环境的构建

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      filename: `js[name].${timestamp}.js`,
      chunkFilename: `js[name].${timestamp}.js`,
    },
  },
  chainWebpack: (config) => {
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        'window.Quill': 'quill',
      },
    ]);
  },
  devServer: {
    port: 8888,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4321/',
      },
    },
  },
};
