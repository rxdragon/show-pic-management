import axios from '@/plugins/axios.js'
import OrderModel from '@/model/OrderModel.js'
import StreamModel from '@/model/StreamModel.js'

/**
 * @description 获取订单列表
 */
export function getOrderList (params) {
  return axios({
    url: '/project_show_pic/admin/order/list',
    method: 'GET',
    params
  }).then(res => {
    res.list = res.list.map(listItem => {
      const orderInfo = new OrderModel(listItem)
      return {
        base: listItem,
        orderInfo,
        productShow: orderInfo.productList[0]
      }
    })
    return res
  }).catch(() => {
    return []
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
    orderInfo.orderItems = orderItems
    const requiresData = orderItems[0]
    requiresData.getRequires(res.order_item[0])
    requiresData.retoucherList = orderItems.map(item => item.retoucherName).join(',')
    requiresData.onlineRetoucherName = orderItems.map(item => item.onlineRetoucherName).join(',')
    const createData = {
      base: res,
      orderInfo,
      requiresData
    }
    return createData
  })
}
