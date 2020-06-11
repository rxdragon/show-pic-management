
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
  activedAt = '-' // 激活时间
  usedAt = '-' // 使用时间
  userId = '' // 使用者id
  userTel = '' // 绑定用户手机号
  userOrderNum = '' // 使用订单号

  constructor (couponData) {
    this.base = couponData
    this.id = couponData.id || 0
    this.code = couponData.code || '-'
    // TODO 优惠券名称
    this.couponBatchTitle = '-'
    this.state = couponData.status || '-'
    this.stateCN = couponToCN[this.state] || '-'
    this.creaetdAt = couponData.created_at || '-'
    this.activedAt = couponData.bind_at || '-'
    this.usedAt = couponData.used_at || '-'
    // TODO 绑定用户手机号
    this.userId = couponData.user_id || '-'
    this.userTel = _.get(couponData, 'userInfo.phone') || '-'
    this.userOrderNum = couponData.order_num || '-'
  }
}
