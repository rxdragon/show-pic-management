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
    // mock数据
    const mock = [
      {
        id: 1,
        name: "手绘",
        state: "online",
        created_at: "2020-06-30 12:00:00",
        updated_at: "2020-06-30 12:00:00"
      },
      {
        id: 2,
        name: "原片变大片",
        state: "offline",
        created_at: "2020-06-30 12:00:00",
        updated_at: "2020-06-30 12:00:00"
      },
      {
        id: 3,
        name: "证件照",
        state: "online",
        created_at: "2020-06-30 12:00:00",
        updated_at: "2020-06-30 12:00:00"
      },
      {
        id: 4,
        name: "全家福",
        state: "lining",
        created_at: "2020-06-30 12:00:00",
        updated_at: "2020-06-30 12:00:00"
      }
    ]
    msg = mock

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
 * @description 获取订单列表
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
