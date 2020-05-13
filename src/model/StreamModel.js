
/**
 * @property {Number} streamId - 流水id
 * @property {String} updated_at -更新时间
 */
import PhotoModal from './PhotoModel.js'
import { REQUIRE } from '@/model/Enumerate.js'

export default class StreamModel {
  id = '' // 流水id
  baseRequires = { // 基础修图要求
    eye: '',
    face: '',
    pimples: false
  }
  referenceDiagram = '' // 参考图
  // 修图备注
  retouchRemark = ''
  retoucherName = '-'
  onlineRetoucherName = '-'
  photoList = []

  constructor (streamData) {
    this.id = streamData.id
    this.retouchRemark = streamData.note
    this.getPhotoList(streamData)
    // TODO 
    this.retoucherName = '-'
    // TODO 
    this.onlineRetoucherName = '-'
  }

  getRequires (streamData) {
    const findRequire = (id) => {
      return streamData.requires.find(item => item.product_require_set_id === id) || {}
    }
    this.baseRequires.eye = findRequire(REQUIRE.EYE).value || ''
    this.baseRequires.face = findRequire(REQUIRE.FACE).value || ''
    this.baseRequires.pimples = findRequire(REQUIRE.PIMPLES).value || ''
    this.referenceDiagram = findRequire(REQUIRE.PIMPLES).value || ''
  }

  getPhotoList (streamData) {
    this.photoList = streamData.photo.map(photoItem => {
      return new PhotoModal(photoItem)
    })
  }
}
