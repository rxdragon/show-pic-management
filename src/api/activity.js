import axios from '@/plugins/axios.js'
import ActivityModel from '@/model/ActivityModel.js'
import CouponBatchModel from '@/model/CouponBatchModel.js'

/**
 * @description 获取活动列表
 */
export function getActivityList (params) {
  return axios({
    url: '/project_show_pic/admin/activity/list',
    method: 'POST',
    data: params
  }).then(msg => {
    msg.list = msg.list.map(listItem => {
      return {
        ...new ActivityModel(listItem)
      }
    })
    return msg
  })
}

/**
 * @description 下线活动
 */
export function offlineActivity (params) {
  return axios({
    url: '/project_show_pic/admin/activity/offline',
    method: 'POST',
    data: params
  })
}

/**
 * @description 删除活动
 */
export function deleteActivity (params) {
  return axios({
    url: '/project_show_pic/admin/activity/del',
    method: 'POST',
    data: params
  })
}

/**
 * @description 删除活动
 */
export function addActivity (params) {
  return axios({
    url: '/project_show_pic/admin/activity/add',
    method: 'POST',
    data: params
  })
}

/**
 * @description 删除活动
 */
export function editActivity (params) {
  return axios({
    url: '/project_show_pic/admin/activity/edit',
    method: 'PUT',
    data: params
  })
}

/**
 * @description 删除活动
 */
export function getActivityDetail (params) {
  return axios({
    url: '/project_show_pic/admin/activity/detail',
    method: 'GET',
    params
  }).then(msg => {
    const createData = {}
    createData.baseForm = {
      activityName: msg.name,
      activityTime: [msg.begin_time, msg.end_time]
    }
    createData.shareForm = {
      fileList: [{
        path: msg.share_config.mainImg,
        percentage: 100,
        status: 'success',
        response: msg.share_config.mainImg
      }],
      activityShareTitle: msg.share_config.title,
      activityShareDesc: msg.share_config.desc
    }
    const apiCouponBatchesData = _.get(msg, 'coupon_batches[0]') || {}
    const couponData = new CouponBatchModel(apiCouponBatchesData)
    createData.couponForm = {
      couponName: couponData.title,
      circulation: couponData.total,
      limitCount: {
        limitType: couponData.limitCount ? 1 : 0,
        count: couponData.limitCount
      },
      type: couponData.couponType,
      erectMoney: couponData.discount, // TODO 判断
      discountRange: couponData.discount,
      discountMaxMoney: couponData.reductionUpperLimit,
      useLimit: {
        usetype: couponData.orderMoneyLowerLimit ? 1 : 0, // 使用门槛
        maxMoney: couponData.orderMoneyLowerLimit, // 多少元可用
      },
      effectivity: {
        effectivityType: couponData.effectivityType,
        autoExceed: couponData.effectivityType === 'receive' ? couponData.autoExceed : '',
        abortTime: couponData.effectivityType === 'fixed' ? couponData.abortTime : ''
      },
      desc: couponData.note
    }
    // 过去按钮渐变颜色
    const type = "#[0-9a-fA-F]{6}"
    const re = new RegExp(type, 'g')
    const [receiveBkgStart, receiveBkgEnd] = msg.style_config.receiveBkgColor.match(re)
    const type2 = /\d+/
    const re2 = new RegExp(type2, 'g')
    const receiveBkgAngle = +msg.style_config.receiveBkgColor.match(re2)[0]
    createData.pageForm = {
      title: msg.style_config.title,
      headerImg: msg.style_config.headerImg, // 页面头图
      bkgColor: msg.style_config.bkgColor, // 页面背景色
      captchaBkgColor: msg.style_config.captchaBkgColor, // 验证码背景色
      captchaTextColor: msg.style_config.captchaTextColor, // 验证码输入颜色
      activityDesc: msg.style_config.rules['*'], // TODO 返回格式不正确
      receiveBkgStart, // 渐变前置颜色
      receiveBkgEnd, // 渐变后置颜色
      receiveBkgAngle,
      receiveBkgColor: msg.style_config.receiveBkgColor, // 领取按钮颜色
      rulesFontColor: msg.style_config.rulesFontColor // 说明字体颜色
    }
    return createData
  })
}
