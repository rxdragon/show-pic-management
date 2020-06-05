import { couponBatchToCN } from '@/model/Enumerate'

const couponTypeEnum = {
  discount_coupon: '折扣券',
  decrease_coupon: '立减券'
}
// 优惠券批次
export default class CouponBatchModel {
  base = {}
  id = 0
  title = '-' // 批次标题
  state = '-' // 批次状态
  stateToCn = '-' // 批次状态

  total = 0 // 总发行量
  activeNum = 0 // 激活数量
  useNum = 0 // 使用数量
  expireNum = 0 // 过期数量
  voidNum = 0 // 作废数量
  waitActiveNum = 0 // 待激活

  createdAt = '' // 创建时间节点
  createdStaff = '' // 创建人
  note = '' // 备注

  couponType = '' // 优惠类型
  couponTypeCN = '' // 优惠类型

  orderMoneyLowerLimit = 0 // 满多少才可下单
  reductionUpperLimit = 0 // 折扣上线
  discount = 0

  effectivityTime = '-' // 有效期

  constructor (couponBatchData) {
    this.base = couponBatchData
    this.id = couponBatchData.id
    this.title = couponBatchData.title || '-'
    this.state = couponBatchData.state || '-'
    this.stateToCn = couponBatchToCN[this.state] || ''
    this.createdAt = couponBatchData.created_at || '-'
    this.createdStaff = _.get(couponBatchData, 'extend.createdStaff.nickname') || _.get(couponBatchData, 'extend.createdStaff.name') || '-'
    this.getCouponNum()
    this.couponType = _.get(couponBatchData, 'extend.couponInfo.extend.type')
    this.couponTypeCN = couponTypeEnum[this.couponType]
    this.note = _.get(couponBatchData, 'extend.couponInfo.extend.note') || '-'
    this.orderMoneyLowerLimit = _.get(couponBatchData, 'extend.couponInfo.extend.limit.orderMoneyLowerLimit') || 0
    this.reductionUpperLimit = _.get(couponBatchData, 'extend.couponInfo.extend.limit.reductionUpperLimit') || 0
    this.discount = _.get(couponBatchData, 'extend.couponInfo.discount') || 0
    this.getEffectivityTime()
  }

  getCouponNum () {
    this.total = this.base.total || 0
    this.activeNum = this.base.active_num || 0
    this.useNum = this.base.use_num || 0
    this.expireNum = this.base.expire_num || 0
    this.voidNum = this.base.void_num || 0
    this.waitActiveNum = this.total - this.activeNum - this.useNum - this.expireNum - this.voidNum
  }

  getEffectivityTime () {
    const startTime = _.get(this.base, 'extend.couponInfo.start_usage')
    const stopTime = _.get(this.base, 'extend.couponInfo.stop_usage')
    const expireDay = _.get(this.base, 'extend.couponInfo.extend.expireDay')
    if (stopTime.includes('2999')) {
      this.effectivityTime = '无限制'
    } else {
      this.effectivityTime = `${startTime}\n${stopTime}`
    }
    if (expireDay) { this.effectivityTime = `自激活后${expireDay}天有效` }
  }
}
