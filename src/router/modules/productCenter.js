import Layout from '@/layout'

const financeCenter = {
  path: '/product-center',
  component: Layout,
  name: 'ProductCenter',
  meta: { title: '产品中心', icon: 'el-icon-sell' },
  alwaysShow: true,
  children: [
    {
      path: 'product-management',
      name: 'ProductManagement',
      component: () => import('@/views/product-center/product-management.vue'),
      meta: { title: '产品管理', icon: '' },
    }
  ]
}

export default financeCenter
