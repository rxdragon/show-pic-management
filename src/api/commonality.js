import axios from '@/plugins/axios.js'

/**
 * @description 获取七牛云接口
 */
export function getSignature () {
  return axios({
    // TODO
    url: '/project_cloud/photoManager/getUploadToken',
    method: 'GET'
  }).then(msg => {
    const createData = {
      token: msg
    }
    return createData
  })
}
