import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout' //

Vue.use(Router)


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
        meta: { title: '概况', icon: 'iconfont iconlogo', affix: true }
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

// export const lastBaseRoutes = [
//   {
//     path: '/update-notes',
//     component: Layout,
//     children: [
//       {
//         path: 'updateNotes',
//         name: 'updateNotes',
//         component: () => import('@/views/update-notes/index.vue'),
//         meta: { title: '关于', icon: 'el-icon-s-order' }
//       }
//     ]
//   }
// ]

export const asyncRoutes = []

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
