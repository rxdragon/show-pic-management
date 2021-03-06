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
  activityName = '-' // 绑定活动名称

  total = 0 // 总发行量
  activeNum = 0 // 激活数量 绑定数量，后端做过过滤
  useNum = 0 // 使用数量
  expireNum = 0 // 过期数量
  voidNum = 0 // 作废数量
  waitActiveNum = 0 // 待绑定
  limitCount = 0 // 每人限量

  createdAt = '' // 创建时间节点
  createdStaff = '' // 创建人
  note = '' // 备注

  couponType = '' // 优惠类型
  couponTypeCN = '' // 优惠类型

  orderMoneyLowerLimit = 0 // 满多少才可下单
  reductionUpperLimit = 0 // 减免上限
  productLimit = '' // 适用产品
  productLimitStr = '' // 适用产品中文
  discount = 0

  effectivityTime = '-' // 有效期
  effectivityType = '' // 有效时间类型
  autoExceed = '' // 自动自激活后多久失效
  abortTime = '' // 固定时间生效

  constructor (couponBatchData) {
    this.base = couponBatchData
    this.id = couponBatchData.id
    this.title = couponBatchData.title || '-'
    this.state = couponBatchData.state || '-'
    this.activityName = _.get(couponBatchData, 'activity.name') || '-'
    this.stateToCn = couponBatchToCN[this.state] || ''
    this.createdAt = couponBatchData.created_at || '-'
    this.createdStaff = _.get(couponBatchData, 'extend.createdStaff.nickname') || _.get(couponBatchData, 'extend.createdStaff.name') || '-'
    this.getCouponNum()
    this.couponType = _.get(couponBatchData, 'extend.couponInfo.extend.type')
    this.couponTypeCN = couponTypeEnum[this.couponType]
    this.note = _.get(couponBatchData, 'extend.couponInfo.extend.note') || '-'
    this.orderMoneyLowerLimit = _.get(couponBatchData, 'extend.couponInfo.extend.limit.orderMoneyLowerLimit') || 0
    this.orderMoneyLowerLimit = Number(this.orderMoneyLowerLimit)
    this.reductionUpperLimit = _.get(couponBatchData, 'extend.couponInfo.extend.limit.reductionUpperLimit') || 0

    // 适用产品
    const couponLimitProducts = _.get(couponBatchData, 'extend.couponInfo.extend.limit.productLimitInfo') || []
    this.productLimit = couponLimitProducts.map(item => Number(item.id))
    this.productLimitStr = ''

    if (this.productLimit.length) {
      const strProductStr = couponLimitProducts.map(item => item.name)
      this.productLimitStr = strProductStr.join('，')
    }

    this.discount = _.get(couponBatchData, 'extend.couponInfo.discount') || 0
    this.getEffectivityTime()
  }

  getCouponNum () {
    this.limitCount = _.get(this.base, 'extend.couponInfo.extend.limitCount') || '无限制'
    this.total = this.base.total || 0
    this.activeNum = this.base.active_num || 0
    this.useNum = this.base.use_num || 0
    this.expireNum = this.base.expire_num || 0
    this.voidNum = this.base.void_num || 0
    this.waitActiveNum = this.total - this.activeNum - this.useNum - this.expireNum - this.voidNum
  }

  getEffectivityTime () {
    this.effectivityType = _.get(this.base, 'extend.couponInfo.extend.dateType')
    const startTime = _.get(this.base, 'extend.couponInfo.start_usage') || '-'
    const stopTime = _.get(this.base, 'extend.couponInfo.stop_usage') || '-'
    const expireDay = _.get(this.base, 'extend.couponInfo.extend.expireDay') || '-'
    if (this.effectivityType === 'limitless') {
      this.effectivityTime = '无限制'
    }
    if (this.effectivityType === 'fixed') {
      this.abortTime = stopTime
      this.effectivityTime = `${startTime}\n${stopTime}`
    }
    if (this.effectivityType === 'receive') {
      this.autoExceed = expireDay
      this.effectivityTime = `自激活后${expireDay}天有效`
    }
  }
}
