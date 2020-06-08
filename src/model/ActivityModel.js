import { activityToCN } from '@/model/Enumerate'
import CouponBatchModel from '@/model/CouponBatchModel'

/**
 * @description 活动模型
 */
export default class ActivityModel {
  base = {}
  id = 0 // 活动编号
  name = '-' // 活动名称
  status = '' // 活动状态
  statusCN = '' // 活动状态
  beginTime = '-' // 活动开始时间
  endTime = '-' // 活动结束时间
  creatorName = '-' // 花名
  couponBatchId = '' // 优惠券id
  couponBatchesInfo = null // 优惠券信息

  constructor (activityData) {
    this.base = activityData
    this.id = activityData.id || 0
    this.name = activityData.name || '-'
    this.status = activityData.status || '-'
    this.statusCN = activityToCN[this.status] || '-'
    this.beginTime = activityData.begin_time || '-'
    this.endTime = activityData.end_time || '-'
    this.creatorName = _.get(activityData, 'user_info.nickname') || _.get(activityData, 'user_info.name') || '-'
    this.getCouponBatchesInfo ()
  }

  // 获取优惠券信息
  getCouponBatchesInfo () {
    const couponBatchesInfo = _.get(this.base, 'coupon_batches[0]') || {}
    this.couponBatchId = _.get(couponBatchesInfo, 'pivot.coupon_batch_id') || ''
    this.couponBatchesInfo = new CouponBatchModel(couponBatchesInfo)
  }
}
