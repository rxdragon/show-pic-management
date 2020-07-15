import axios from '@/plugins/axios.js'
import { ProductStatusNameEnum } from '@/model/Enumerate.js'

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
        case 'online':
          productList[0].children.push({
            label: item.name,
            id: item.id,
            status: 'online'
          })
          break
        case 'offline':
          productList[1].children.push({
            label: item.name,
            id: item.id,
            status: 'offline'
          })
          break
        case 'lining':
          productList[2].children.push({
            label: item.name,
            id: item.id,
            status: 'lining'
          })
          break
      
        default:
          break
      }
    })
    return productList
  })
}

