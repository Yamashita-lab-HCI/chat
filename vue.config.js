const { defineConfig } = require("@vue/cli-service");
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "/Users/keis/dev/chat_backend/static",
  indexPath: "/Users/keis/dev/chat_backend/templates/index.html",
  publicPath: process.env.NODE_ENV === "production" ? "/static/" : "/",
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@ckeditor': path.resolve(__dirname, 'node_modules/@ckeditor'),
        'vue$': 'vue/dist/vue.esm-bundler.js'
      },
      extensions: ['.js', '.vue', '.json']
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('va-')
        }
      }));
  }
});
