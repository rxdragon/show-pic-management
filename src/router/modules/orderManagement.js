import Layout from '@/layout'

const orderManagement = {
  path: '/order-management',
  component: Layout,
  name: 'orderManagement',
  redirect: '/order-management/order-manage',
  meta: { title: '订单管理', icon: 'iconfont icondingdanguanli' },
  children: [
    {
      path: 'order-manage',
      name: 'orderManage',
      component: () => import('@/views/order-management/order-management.vue'),
      meta: { title: '订单管理', icon: '', breadcrumb: false }
    },
    {
      path: 'order-detail',
      name: 'orderDetail',
      component: () => import('@/views/order-management/order-detail.vue'),
      meta: { title: '订单详情', icon: '', activeMenu: '/order-management/order-manage' },
      hidden: true
    }
  ]
}

export default orderManagement
