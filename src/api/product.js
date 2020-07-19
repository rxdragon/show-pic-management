import axios from '@/plugins/axios.js'

/**
 * @description 获取订单列表
 */
export function getProductList () {
  const params = {
    cond: { stateIn: ['online', 'wait'] }
  }
  return axios({
    url: '/project_show_pic/admin/trading/product/getList',
    method: 'POST',
    data: params
  }).then(msg => {
    if (msg instanceof Array) {
      msg.sort((a, b) => b.weight - a.weight)
    } else {
      msg = []
    }
    return msg
  })
}

/**
 * @description 提交排序
 * @param {*} params 
 */
export function sortProduct (params) {
  return axios({
    url: '/project_show_pic/admin/trading/product/sort',
    method: 'POST',
    data: params
  })
}
