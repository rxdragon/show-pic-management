import axios from '@/plugins/axios.js'
import CouponBatchModel from '@/model/CouponBatchModel'
import CouponModel from '@/model/CouponModel'

/**
 * @description 获取优惠券批次列表
 */
export function getCouponBatchList (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/getCouponBatchList',
    method: 'POST',
    data: params
  }).then(msg => {
    msg.list = msg.list.map(listItem => {
      return {
        ...new CouponBatchModel(listItem),
        showPopover: false
      }
    })
    return msg
  })
}

/**
 * @description 优惠券批次作废
 */
export function voidCouponBatch (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/voidCouponBatch',
    method: 'PUT',
    data: params
  })
}

/**
 * @description 获取券码信息
 * @param {*} params 
 */
export function searchCouponCode (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/detail',
    method: 'GET',
    params
  }).then(msg => {
    const createData = new CouponModel(msg)
    return createData
  })
}

/**
 * @description 获取批次详情
 * @param {*} params 
 */
export function getCouponBatchDetail (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/getCouponBatchDetail',
    method: 'GET',
    params
  }).then(msg => {
    return new CouponBatchModel(msg)
  })
}

/**
 * @description 生成优惠券
 * @param {*} params 
 */
export function addCouponBatch (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/addCouponBatch',
    method: 'POST',
    data: params
  }).then(msg => {
    return msg
  })
}

/**
 * @description 生成优惠券
 * @param {*} params 
 */
export function getCouponBatchCodeUseList (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/getCouponBatchCodeUseList',
    method: 'POST',
    data: params
  }).then(msg => {
    msg.list = msg.list.map(listItem => {
      return {
        ...new CouponModel(listItem),
        showPopover: false
      }
    })
    return msg
  })
}

/**
 * @description 券码作废
 */
export function voidCouponCode (params) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/voidCouponCode',
    method: 'PUT',
    data: params
  })
}
