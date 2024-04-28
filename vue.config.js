const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '/Users/keis/Desktop/2023/山下研/chat_backend/static',  // Djangoのstaticディレクトリへのパス
  indexPath: '/Users/keis/Desktop/2023/山下研/chat_backend/templates/index.html',  // Djangoのtemplatesディレクトリへのパス
  publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/'
});
