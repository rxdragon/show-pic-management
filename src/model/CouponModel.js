
import { couponToCN } from '@/model/Enumerate.js'
// 券码数据
export default class CouponModel {
  base = {}
  id = 0
  code = '-'
  couponBatchTitle = '-' // 优惠券名称
  state = '-'
  stateCN = '-'
  creaetdAt = '-' // 创建时间
  bindAt = '-' // 绑定时间
  usedAt = '-' // 使用时间
  userId = '' // 使用者id
  userTel = '' // 绑定用户手机号
  userOrderNum = '' // 使用订单号
  productLimit = [] // 适用产品
  productLimitStr = '' // 适用产品中文

  constructor (couponData) {
    this.base = couponData
    this.id = couponData.id || 0
    this.code = couponData.code || '-'
    this.couponBatchTitle = _.get(couponData, 'coupon_batch.title') || '-'
    this.state = couponData.status || '-'
    this.stateCN = couponToCN[this.state] || '-'
    this.creaetdAt = couponData.created_at || '-'
    this.bindAt = couponData.bind_at || '-'
    this.usedAt = couponData.used_at || '-'
    this.userId = couponData.user_id || '-'
    this.userTel = _.get(couponData, 'userInfo.phone') || '-'
    this.userOrderNum = couponData.order_num || '-'

    // 适用产品
    const couponLimitProducts = _.get(couponData, 'coupon_batch.extend.couponInfo.extend.limit.productLimitInfo') || []
    this.productLimit = couponLimitProducts.map(item => item.id)
    this.productLimitStr = ''

    if (this.productLimit.length) {
      const allCouponLimitProductsStrArr = couponLimitProducts.map(item => item.name)
      this.productLimitStr = allCouponLimitProductsStrArr.join('，')
    }
  }
}
