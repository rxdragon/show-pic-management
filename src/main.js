import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局过滤器
import './plugins/axios'
import './plugins/element.js' // ui布局
import './plugins/icon-font/iconfont.css' // 字体
import './assets/styles/font.less' // 全局样式
import './assets/styles/index.less' // 字体
import '@assetsDir/styles/variables.less' // 全局样式
import './guards' // 路由守护
import '@/directive'

Vue.config.productionTip = false

// 注入全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 判断是否是生产环境
// Vue.prototype.$isDev = !process.env.VUE_APP_LOGIN_API.includes('k8s')
Vue.prototype.$isDev = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
