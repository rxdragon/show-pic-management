import axios from '@/plugins/axios.js'
import OrderModel from '@/model/OrderModel.js'
import StreamModel from '@/model/StreamModel.js'
import store from '@/store' // vuex


/**
 * @description 获取订单列表
 */
export function getOrderList (params) {
  return axios({
    url: '/project_show_pic/admin/order/list',
    method: 'PUT',
    data: params
  }).then(res => {
    res.list = res.list.map(listItem => {
      const orderInfo = new OrderModel(listItem)
      return {
        base: listItem,
        ...orderInfo,
        productShow: orderInfo.productList[0]
      }
    })
    return res
  }).catch(() => {
    return {
      list: [],
      total: 0
    }
  })
}

/**
 * @description 获取订单列表
 */
export function exportExcel (params) {
  return axios({
    url: '/project_show_pic/admin/order/export',
    method: 'PUT',
    data: params
  }).then(res => {
    const createData = res.map(listItem => {
      const orderInfo = new OrderModel(listItem)
      orderInfo.productListString = orderInfo.productList.join('\n')
      orderInfo.productListSet = [...new Set(orderInfo.productList)]
      orderInfo.productNum = orderInfo.productListSet.length
      return {
        base: listItem,
        ...orderInfo,
        productShow: orderInfo.productList[0]
      }
    })
    return createData
  })
}

/**
 * @description 关闭订单
 */
export function closeOrder (params) {
  return axios({
    url: '/project_show_pic/admin/order/close',
    method: 'PUT',
    data: params
  })
}

/**
 * @description 订单详情
 */
export function getOrderDetail (params) {
  return axios({
    url: '/project_show_pic/admin/order/detail',
    method: 'GET',
    params
  }).then(res => {
    const orderInfo = new OrderModel(res)
    orderInfo.productShow = orderInfo.productList[0]
    const orderItems = res.order_item.map(item => new StreamModel(item))
    // 获取修图信息
    const requiresData = orderItems[0]
    requiresData.getRequires()
    requiresData.retoucherList = orderItems.map(item => item.retoucherName).join(',')
    requiresData.onlineRetoucherName = orderItems.map(item => item.onlineRetoucherName).join(',')
    requiresData.referenceDiagramOriginal = store.getters.imgCompressDomain + requiresData.referenceDiagram
    requiresData.referenceDiagramCompress = store.getters.imgCompressDomain + requiresData.referenceDiagram
    // 获取全部照片
    let orderPhotoList = []
    orderItems.forEach((streamItem, streamIndex) => {
      streamItem.photoList.forEach(photoItem => {
        photoItem.streamlabel = `流水${streamIndex + 1}`
      })
      orderPhotoList = [...orderPhotoList, ...streamItem.photoList]
    })
    const createData = {
      base: res,
      ...orderInfo,
      requiresData,
      orderPhotoList
    }
    return createData
  })
}

/**
 * @description 更新修图信息
 * @param {*} params 
 */
export function editRetouchClaim (params) {
  return axios({
    url: '/project_show_pic/admin/order/editRetouchClaim',
    method: 'PUT',
    data: params
  })
}
