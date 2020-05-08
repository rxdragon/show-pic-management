import Layout from '@/layout'

const userManagement = {
  path: '/user-management',
  component: Layout,
  name: 'userManagement',
  redirect: '/user-management/user-manage',
  meta: { title: '用户管理', icon: 'iconfont iconyonghuguanli' },
  children: [
    {
      path: 'user-manage',
      name: 'userManage',
      component: () => import('@/views/user-management/user-management.vue'),
      meta: { title: '用户管理', icon: '', breadcrumb: false }
    },
    {
      path: 'user-detail',
      name: 'userDetail',
      component: () => import('@/views/user-management/user-detail.vue'),
      meta: { title: '用户详情', icon: '', activeMenu: '/user-management/user-manage' },
      hidden: true
    }
  ]
}

export default userManagement
