/**
 * @description 订单model
 */

import {
  ORDER_STATE,
  STREAM_STATE,
  SECOND_RETOUCH_STATE,
  orderStateToCN,
  streamToCN,
  secondRetouchStateToCN,
} from '@/model/Enumerate.js'

export default class OrderModel {
  base = {}
  id = '' // 订单id
  orderNum = '' // 订单号
  state = '' // 订单状态
  stateCN = '' // 订单状态中文

  allPrice = 0 // 订单总金额
  discountsPrice = 0 // 订单优惠金额
  totalFee = 0 // 订单实付金额
  couponCode = '-' // 优惠券 TODO

  photoNum = 0 // 照片数量
  productList = [] // 产品列表
  createdAt = '-' // 创建时间
  paidAt = '-' // 支付时间
  cloudFinishAt = '-' // 云端完成时间
  confirmAt = '-' // 确定时间
  closeOperator = '-' // 订单关闭操作员
  closeReason = '-' // 订单关闭理由
  clientName = '-' // 顾客姓名
  clientAccount = '-' // 顾客账号
  clientPhone = '-' // 顾客手机号
  orderFrom = '-' // 订单来源

  constructor (orderData) {
    if (!orderData) return
    this.base = orderData
    this.id = orderData.id
    this.orderNum = orderData.order_num || '-'
    this.getOrderPrice()
    this.photoNum = orderData.photo_count || 0
    this.getTimes(orderData)
    this.getProduct(orderData)
    this.orderState = orderData.state
    this.stateCN = this.getOrderState(orderData)
    this.orderFrom = orderData.from
    this.closeOperator = _.get(orderData, 'extend.closeInfo.userInfo.nickname') || _.get(orderData, 'extend.closeInfo.userInfo.name') || '-'
    this.closeReason = _.get(orderData, 'extend.closeInfo.reason') || '-'
    this.clientName = _.get(orderData, 'userInfo.name') || '-'
    this.clientAccount = _.get(orderData, 'userInfo.phone') || '-'
    this.clientPhone = _.get(orderData, 'userInfo.phone') || '-'
    
  }

  // 订单金额
  getOrderPrice () {
    this.totalFee = Number(this.base.total_fee) || 0
    this.allPrice = Number(this.base.order_fee) || 0
    this.discountsPrice = Number(this.base.discount_fee) || 0
  }

  // 获取时间点
  getTimes (orderData) {
    this.createdAt = orderData.created_at || '-'
    this.paidAt = orderData.paid_at || '-'
    this.cloudFinishAt = orderData.cloud_finish_at || '-'
    this.confirmAt = orderData.confirm_at || '-'
  }

  // 获取产品信息
  getProduct (orderData) {
    const orderItems = orderData.order_item || []
    this.productList = orderItems.map(orderItem => _.get(orderItem, 'product_sku.name') || '-')
  }

  // 获取订单状态
  getOrderState (orderData) {
    // 显示在线看片状态
    const showSecondRetouchState = [SECOND_RETOUCH_STATE.ADJUSTING, SECOND_RETOUCH_STATE.SATISFIED]
    // 显示订单状态
    const showOrderState = [ORDER_STATE.WAIT_PAIED, ORDER_STATE.COMPLETE, ORDER_STATE.CANCELLED]

    const orderItems = orderData.order_item
    // 订单状态
    const orderState = this.orderState
    // 在线看片状态
    const orderItemSecondRetouchState = this.getOrderItemSecondRetouchState(orderItems)
    // 流水状态
    const streamState = this.getStreamState(orderItems)

    if (orderState === ORDER_STATE.CLOSED) return orderStateToCN[orderState]
    if (orderState === ORDER_STATE.COMPLETE) return orderStateToCN[orderState]
    if (showSecondRetouchState.includes(orderItemSecondRetouchState)) return secondRetouchStateToCN[orderItemSecondRetouchState]
    if (showOrderState.includes(orderState)) return orderStateToCN[orderState]
    if (orderState === ORDER_STATE.PAID) return streamToCN[streamState]
  }

  // 获取在线看片状态
  getOrderItemSecondRetouchState (orderItems) {
    const hasAllSatisfied = orderItems.every(item => item.second_retouch_state === SECOND_RETOUCH_STATE.SATISFIED)
    const hasAdjusting = orderItems.some(item => item.second_retouch_state === SECOND_RETOUCH_STATE.ADJUSTING)
    const hasAllNoNeed = orderItems.every(item => item.second_retouch_state === SECOND_RETOUCH_STATE.NO_NEED)
    if (hasAllSatisfied) return SECOND_RETOUCH_STATE.SATISFIED
    if (hasAdjusting) return SECOND_RETOUCH_STATE.ADJUSTING
    if (hasAllNoNeed) return SECOND_RETOUCH_STATE.NO_NEED
    return SECOND_RETOUCH_STATE.WAIT_ADJUST
  }

  // 获取流水状态
  getStreamState (orderItems) {
    const hasAllComplete = orderItems.every(item => item.state === STREAM_STATE.COMPLETE)
    const hasSomComplete = orderItems.some(item => item.state === STREAM_STATE.COMPLETE)
    const hasRetouching = orderItems.some(item => item.state === STREAM_STATE.RETOUCHING)
    if (hasAllComplete) return STREAM_STATE.COMPLETE
    if (hasRetouching || hasSomComplete) return STREAM_STATE.RETOUCHING
    return STREAM_STATE.WAIT_RETOUCH
  }
}
