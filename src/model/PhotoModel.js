import { PHOTO_VERSION } from '@/model/Enumerate.js'

export default class PhotoModel {
  id = ''
  originalPath = ''
  finalPath = ''
  photoVersion = []

  constructor (photoData) {
    this.id = photoData.id
    this.originalPath = photoData.original_path
    this.finalPath = photoData.final_path
    this.getPhotoVersion(photoData)
  }

  // 获取版本列表
  getPhotoVersion (photoData) {
    const versionList = [PHOTO_VERSION.ORIGINAL_PATH, PHOTO_VERSION.FINAL_PATH]
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
