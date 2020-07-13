import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout' //

Vue.use(Router)

import orderManagement from './modules/orderManagement.js' // 订单管理
import userManagement from './modules/userManagement.js' // 订单管理
import financeCenter from './modules/financeCenter.js' // 财务中心
import marketingCenter from './modules/marketingCenter.js' // 营销中心
import productCenter from './modules/productCenter.js' // 产品中心

// 基础权限路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  }, {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    hidden: true
  }, {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/home.vue'),
        meta: { title: '概况', icon: 'iconfont icongailan', affix: true }
      }
    ]
  }, {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }, {
    path: '*',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  orderManagement,
  userManagement,
  financeCenter,
  marketingCenter,
  productCenter
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// url不变强制刷行
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
