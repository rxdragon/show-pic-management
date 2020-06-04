
// 券码数据
export default class CouponModel {
  base = {}
  id = 0
  code = '-'
  couponBatchTitle = '-' // 优惠券名称
  state = '-'
  creaetdAt = '-' // 创建时间
  activedAt = '-' // 激活时间
  usedAt = '-' // 使用时间
  userId = '' // 使用者id
  userOrderNum = '' // 使用订单号

  constructor (couponData) {
    this.base = couponData
    this.id = couponData.id || 0
    this.code = couponData.code || '-'
    // TODO 优惠券名称
    this.couponBatchTitle = '-'
    this.state = couponData.state || '-'
    this.creaetdAt = couponData.creaetd_at || '-'
    // TODO 激活时间
    this.activedAt = couponData.activedAt || '-'
    this.usedAt = couponData.used_at || '-'
    this.userId = couponData.userId || '-'
    this.userOrderNum = couponData.order_num || '-'
  }
}
