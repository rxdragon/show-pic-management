import axios from '@/plugins/axios.js'

/**
 * @description 获取订单列表
 */
export function getProductList () {
  // TODO mock 调试
  // const params = {
  //   cond: {
  //     state: 'online'
  //   }
  // }
  
  // return axios({
  //   url: '/project_show_pic/admin/order/list',
  //   method: 'POST',
  //   data: params
  // }).then(res => {
    
  //   return res
  // })
  const mock = [
    {
      id: 1,
      weight: 12,
      name: "婚纱照",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 2,
      weight: 11,
      name: "手绘",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 3,
      weight: 10,
      name: "原片变大片",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 4,
      weight: 9,
      name: "工笔风",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 5,
      weight: 8,
      name: "守护小怪兽",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 6,
      weight: 7,
      name: "定制小怪兽",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 7,
      weight: 6,
      name: "文艺照/肖像照",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 8,
      weight: 5,
      name: "证件照",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 9,
      weight: 4,
      name: "结婚登记照",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 10,
      weight: 3,
      name: "职业形象照",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 11,
      weight: 2,
      name: "全家福",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    },
    {
      id: 12,
      weight: 1,
      name: "手账",
      state: "online",
      created_at: "2020-06-30 12:00:00",
      updated_at: "2020-06-30 12:00:00"
    }
  ]
  return new Promise ((reslove, reject) => {
    setTimeout(() => {
      reslove(mock)
    }, 1000)
  })
}

/**
 * @description 提交分数
 * @param {*} params 
 */
export function sortProduct (params) {
  return axios({
    // TODO
    url: 'https://doc.local.hzmantu.com/project_show_pic/release-1.4.0-feature-product/project_show_pic/admin/trading/product/sort',
    // url: '/project_show_pic/admin/trading/product/sort',
    method: 'POST',
    data: params
  })
}
