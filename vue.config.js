/* eslint-disable no-console */
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true, // 是否使用md5码
  lintOnSave: true, // eslint 错误处理，true表示对待eslint错误为warnings，warnings不会导致编译失败
  productionSourceMap: true, // 生产环境是否开启source map
  integrity: false, // 内容安全策略及子资源完整性
  configureWebpack: (c) => {
    const config = {
      resolve: {
        alias: {
          '@': resolve('src'),
          '@assetsDir': resolve('src/assets'),
          '@selectBox': resolve('src/components/SelectBox'),
        }
      }
    }
    return config
  },
  chainWebpack: config => {
    if (config.plugins.has('progress') && process.env.CI_RUNNER_ID) {
      config.plugins.delete('progress')
    }
    config.plugin('define')
      .tap(args => {
        args[0].BUILD_TIME = +Date.now()
        args[0].BUILD_REDIRECT = '"/login.html"'
        console.log(process.env.CI_RUNNER_ID)
        console.log(args[0]['process.env'].NODE_ENV)
        console.log(args[0]['process.env'].NODE_ENV === '"development"')
        if (process.env.CI_RUNNER_ID && args[0]['process.env'].NODE_ENV === '"development"') {
          args[0].BUILD_REDIRECT = "/show-pic-management/login.html"
        }
        return args
      })
  }
}
