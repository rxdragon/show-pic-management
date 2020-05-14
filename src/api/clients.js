import axios from '@/plugins/axios.js'
import UserModel from '@/model/UserModel.js'
/**
 * @description 获取用户列表
 */
export function getOrderList (params) {
  return axios({
    url: '/project_show_pic/admin/user/list',
    method: 'PUT',
    data: params
  }).then(res => {
    res.list = res.list.map(listItem => {
      const userInfo = new UserModel(listItem)
      return { ...userInfo }
    })
    return res
  }).catch(error => {
    return {
      list: [],
      total: 0
    }
  })
}

/**
 * @description 获取用户列表
 */
export function getOrderDetail (params) {
  return axios({
    url: '/project_show_pic/admin/user/detail',
    method: 'GET',
    params
  }).then(res => {
    const userInfo = new UserModel(res)
    return userInfo
  })
}
