import { PHOTO_VERSION } from '@/model/Enumerate.js'

export default class PhotoModel {
  base = {}
  id = '' // 照片id
  originalPath = '' // 原片
  cloudFinishPath = '' // 云端成片
  finalPath = '' // 顾客满意片
  photoVersion = [] // 照片版本

  constructor (photoData) {
    this.base = photoData
    this.id = photoData.id
    this.originalPath = photoData.original_path
    this.finalPath = photoData.final_path
    this.cloudFinishPath = photoData.cloud_finish_path
    this.getPhotoVersion(photoData)
  }

  // 获取版本列表
  getPhotoVersion (photoData) {
    const versionList = [PHOTO_VERSION.ORIGINAL_PATH, PHOTO_VERSION.CLOUD_FINISH_PATH, PHOTO_VERSION.FINAL_PATH]
    const createData = []
    versionList.forEach(versionItem => {
      createData.push({
        version: versionItem,
        src: photoData[versionItem]
      })
    })
    this.photoVersion = createData
  }
}
