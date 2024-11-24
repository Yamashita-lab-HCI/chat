const { defineConfig } = require("@vue/cli-service");
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "/Users/keis/dev/chat_backend/static", // Djangoのstaticディレクトリへのパス
  indexPath: "/Users/keis/dev/chat_backend/templates/index.html", // Djangoのtemplatesディレクトリへのパス
  publicPath: process.env.NODE_ENV === "production" ? "/static/" : "/",
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@ckeditor': path.resolve(__dirname, 'node_modules/@ckeditor'),
      },
    },
  },
});
