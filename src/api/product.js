import axios from '@/plugins/axios.js'

/**
 * @description 获取产品列表
 */
export function getProductList (params = {
  page: 1,
  pageSize: 10
}) {
  return axios({
    url: '/project_show_pic/admin/marketing/coupon/getCouponBatchList',
    method: 'POST',
    data: params
  }).then(msg => {
    const productList = [{
      label: '已上线',
      id: 0,
      children: []
    }, {
      label: '已下线',
      id: 1,
      children: []
    }, {
      label: '上线中',
      id: 2,
      children: []
    }]
    msg = [
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

