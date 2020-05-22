import Zip from '@/utils/jszip.js'
import store from '@/store' // vuex
import { newMessage } from '@/utils/message.js'

const domain = store.getters.imgDomain

export function downOnePicture (src) {
  const url = src.includes('http') ? src : domain + src
  window.location = url + '?attname='
}

/**
 * @description 下载zip
 * @param {*} imgArr 照片列表
 */
export function downForZip (imgArr, zipName = "照片", cb) {
  const zipclass = new Zip()
  imgArr = imgArr.map(src => {
    return src.includes('http') ? src : domain + src
  })
  zipclass.downZip(imgArr, zipName, ()=> {
    if (cb) cb()
    newMessage.success('已添加下载，请勿关闭该浏览器标签')
  })
}
