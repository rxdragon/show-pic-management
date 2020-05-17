import axios from '@/plugins/axios.js'
import InvoiceModel from '@/model/InvoiceModel'
import OrderModel from '@/model/OrderModel.js'

/**
 * @description 获取订单列表
 */
export function getInvoiceList (params) {
  // TODO
  const mock = 'https://project-cloud.local.hzmantu.com'
  return axios({
    url: mock + '/project_show_pic/admin/invoice/list',
    method: 'GET',
    params
  }).then(res => {
    res.list = res.list.map(listItem => {
      return new InvoiceModel(listItem)
    })
    return res
  }).catch(() => {
    return {
      total: 0,
      list: []
    }
  })
}

/**
 * @description 作废
 */
export function voidInvoice (params) {
  // TODO
  const mock = 'https://project-cloud.local.hzmantu.com'
  return axios({
    url: mock + '/project_show_pic/admin/invoice/void',
    method: 'PUT',
    data: params
  })
}

/**
 * @description 重新发送
 */
export function resendInvoice (params) {
  // TODO
  const mock = 'https://project-cloud.local.hzmantu.com'
  return axios({
    url: mock + '/project_show_pic/admin/invoice/resend',
    method: 'POST',
    data: params
  })
}

/**
 * @description 获取可开发票订单列表
 */
export function getCanInvoiceOrderList (params) {
  // TODO
  const mock = 'https://project-cloud.local.hzmantu.com'
  return axios({
    url: mock + '/project_show_pic/admin/invoice/getWithInvoiceOrderList',
    method: 'GET',
    params
  }).then(res => {
    res.list = res.list.map(listItem => {
      // TODO 缺少发票状态
      const invoiceId = _.get(listItem, 'order_extend.invoice_id') || ''
      const invoiceState = Boolean(invoiceId) ? 'complete' : 'fail'
      const invoiceStateCN = invoiceState === 'complete' ? '已开票' : '未开票'
      const isCheck = false
      const canInvoiceMoney = Number(listItem.total_fee)
      return {
        ...new OrderModel(listItem),
        invoiceStateCN,
        canCheck: !Boolean(invoiceId),
        isCheck,
        canInvoiceMoney
      }
    })
    return res
  })
}

/**
 * @description 开票
 */
export function applyInvoice (params) {
  // TODO
  const mock = 'https://project-cloud.local.hzmantu.com'
  return axios({
    url: mock + '/project_show_pic/admin/invoice/applyInvoice',
    method: 'PUT',
    data: params
  })
}
