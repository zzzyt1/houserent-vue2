const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

//配置接口跨域
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  outputDir: "dist",
  assetsDir: "assets",
  lintOnSave: false,
  runtimeCompiler: true,
  transpileDependencies: false,
  productionSourceMap: true,

  parallel: require("os").cpus().length > 1,
  pluginOptions: {
    // 第三方插件配置
  },
  pwa: {
    // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 8080,
    https: false,
    hot: false,
    proxy: {
      "/api": {
        target: "http://localhost:5000/api/",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      '/mapApi': {
        target: 'https://apis.map.qq.com',
        changeOrigin: true,
        pathRewrite: {
          '^/mapApi': ''
        }
      }
    },
  },
};
