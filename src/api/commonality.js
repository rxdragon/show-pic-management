import axios from '@/plugins/axios.js'

/**
 * @description 获取七牛云接口
 */
export function getSignature () {
  return axios({
    url: '/project_show_pic/common/getUploadToken',
    method: 'GET'
  }).then(msg => {
    const createData = {
      token: msg
    }
    return createData
  })
}
