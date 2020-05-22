import Layout from '@/layout'

const financeCenter = {
  path: '/finance-center',
  component: Layout,
  name: 'FinanceCenter',
  redirect: '/finance-center/finance-index',
  meta: { title: '财务中心', icon: 'iconfont iconcaiwuzhongxin' },
  alwaysShow: true,
  children: [
    {
      path: 'finance-index',
      name: 'FinanceIndex',
      redirect: '/finance-center/finance-index/invoice-center',
      component: () => import('@/views/finance-center/finance-index.vue'),
      meta: { title: '发票管理', icon: '' },
      children: [
        {
          path: 'invoice-center',
          name: 'InvoiceCenter',
          meta: { title: '发票管理', icon: '', breadcrumb: false },
          component: () => import('@/views/finance-center/invoice-center.vue'),
        },
        {
          path: 'invoice-issue',
          name: 'InvoiceIssue',
          component: () => import('@/views/finance-center/invoice-issue.vue'),
          meta: { title: '发票开具', icon: '', activeMenu: '/finance-center/finance-index' },
          hidden: true
        }
      ]
    }
  ]
}

export default financeCenter
