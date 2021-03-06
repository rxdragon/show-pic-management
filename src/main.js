import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import ApiError from '@/plugins/ApiError.js'
import * as filters from './filters' // 全局过滤器
import './plugins/axios'
import 'element-ui/lib/theme-chalk/display.css' // 栅格隐藏
import './plugins/element.js' // ui布局
import './plugins/logSdk.js' // 错误日志记录
import './plugins/icon-font/iconfont.css' // 字体
import './assets/styles/font.less' // 全局样式
import './assets/styles/index.less' // 字体
import '@assetsDir/styles/variables.less' // 全局样式
import './guards' // 路由守护
import '@/directive'

const version = '1.0.0'
console.warn(version)

window._ = { get, sortBy }
Vue.config.productionTip = false

// 注入全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 增加自定义ApiError
Vue.prototype.$ApiError = ApiError

// 判断是否是生产环境
Vue.prototype.$isDev = !process.env.VUE_APP_LOGIN_API.includes('online')

// 优化全局loading关闭
Vue.prototype.$loadingClose = () => {
  if (!document.getElementsByClassName('el-loading-mask').length || !document.getElementsByClassName('is-fullscreen').length) return
  setTimeout(() => {
    Vue.prototype.$loading().close()
  }, 400)
}

// 重新刷新
Vue.prototype.$refresh = (VueComponentObj) => {
  const view = VueComponentObj.$route
  const { fullPath } = view
  VueComponentObj.$router.replace({
    path: '/redirect' + fullPath
  })
}

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
