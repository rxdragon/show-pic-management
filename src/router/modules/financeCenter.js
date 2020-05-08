import Layout from '@/layout'

const financeCenter = {
  path: '/finance-center',
  component: Layout,
  name: 'financeCenter',
  redirect: '/finance-center/finance-index',
  meta: { title: '财务中心', icon: 'iconfont iconcaiwuzhongxin' },
  alwaysShow: true,
  children: [
    {
      path: 'finance-index',
      name: 'financeIndex',
      component: () => import('@/views/finance-center/finance-index.vue'),
      meta: { title: '发票管理', icon: '', breadcrumb: false }
    },
    {
      path: 'invoice-issue',
      name: 'invoiceIssue',
      component: () => import('@/views/finance-center/invoice-issue.vue'),
      meta: { title: '发票开具', icon: '', activeMenu: '/finance-center/finance-index' },
      hidden: true
    }
  ]
}

export default financeCenter
