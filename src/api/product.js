import axios from '@/plugins/axios.js'
import { ProductStatusNameEnum, PRODUCT_STATE } from '@/model/Enumerate.js'

/**
 * @description 获取产品列表
 */
export function getProductList () {
  return axios({
    url: '/project_show_pic/admin/trading/product/getList',
    method: 'POST',
  }).then(msg => {
    const productList = [{
      label: ProductStatusNameEnum.online,
      children: []
    }, {
      label: ProductStatusNameEnum.offline,
      children: []
    }, {
      label: ProductStatusNameEnum.lining,
      children: []
    }]
    msg.forEach((item) => {
      switch (item.state) {
        case PRODUCT_STATE.ONLINE:
          productList[0].children.push({
            label: item.name,
            id: item.id,
            status: PRODUCT_STATE.ONLINE
          })
          break
        case PRODUCT_STATE.OFFLINE:
          productList[1].children.push({
            label: item.name,
            id: item.id,
            status: PRODUCT_STATE.OFFLINE
          })
          break
        case PRODUCT_STATE.LINING:
          productList[2].children.push({
            label: item.name,
            id: item.id,
            status: PRODUCT_STATE.LINING
          })
          break
      
        default:
          break
      }
    })
    return productList
  })
}

/**
 * @description 获取产品列表用于排序
 */
export function getProductListForSort () {
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
 * @description 新增产品接口
 */
export function addProduct (params) {
  return axios({
    url: '/project_show_pic/admin/trading/product/addWithConfig',
    method: 'POST',
    data: params
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

/**
 * @description 获取产品详情
 * @param {*} params 
 */
export function getInfo (params) {
  return axios({
    url: '/project_show_pic/admin/trading/product/info',
    method: 'GET',
    params
  })
}

/**
 * @description 编辑产品
 * @param {*} params 
 */
export function edit (params) {
  return axios({
    url: '/project_show_pic/admin/trading/product/edit',
    method: 'POST',
    data: params
  })
}
