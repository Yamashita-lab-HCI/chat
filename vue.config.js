const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "/home/ubuntu/chat_backend/static", // Djangoのstaticディレクトリへのパス
  indexPath: "/home/ubuntu/chat_backend/templates/index.html", // Djangoのtemplatesディレクトリへのパス
  publicPath: process.env.NODE_ENV === "production" ? "/static/" : "/",
  filenameHashing: true,
});