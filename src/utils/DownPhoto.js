import Zip from '@/utils/jszip.js'
import { newMessage } from '@/utils/message.js'

export function downOnePicture (src) {
  window.location = src + '?attname='
}

/**
 * @description 下载zip
 * @param {*} imgArr 照片列表
 */
export function downForZip (imgArr, zipName = "照片", cb) {
  const zipclass = new Zip()
  zipclass.downZip(imgArr, zipName, ()=> {
    if (cb) cb()
    newMessage.success('已添加下载，请勿关闭该浏览器标签')
  })
}
