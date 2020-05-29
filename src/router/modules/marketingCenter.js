import Layout from '@/layout'

const financeCenter = {
  path: '/marketing-center',
  component: Layout,
  name: 'MarketingCenter',
  redirect: '/marketing-center/coupon-management',
  meta: { title: '营销中心', icon: 'iconfont iconcaiwuzhongxin' },
  alwaysShow: true,
  children: [
    {
      path: 'coupon-management',
      name: 'CouponManagement',
      redirect: '/marketing-center/coupon-management/coupon-list',
      component: () => import('@/views/marketing-center/coupon-management.vue'),
      meta: { title: '优惠劵管理', icon: '' },
      children: [
        {
          path: 'coupon-list',
          name: 'CouponList',
          meta: { title: '优惠劵管理', icon: '', breadcrumb: false },
          component: () => import('@/views/marketing-center/coupon-list.vue'),
        },
        {
          path: 'creation-coupon',
          name: 'CreationCoupon',
          component: () => import('@/views/marketing-center/creation-coupon.vue'),
          meta: { title: '批量生成优惠劵', icon: '', activeMenu: '/marketing-center/coupon-management/coupon-list' },
          hidden: true
        },
        {
          path: 'coupon-detail',
          name: 'CouponDetail',
          component: () => import('@/views/marketing-center/coupon-detail.vue'),
          meta: { title: '券码详情', icon: '', activeMenu: '/marketing-center/coupon-management/coupon-list' },
          hidden: true
        }
      ]
    }
  ]
}

export default financeCenter
