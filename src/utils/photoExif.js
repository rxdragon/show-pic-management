import EXIF from 'exif-js'

const COLOR_SPACE = {
  1: 'SRGB',
  65535: 'CMYK'
}

/**
 * @description 读取图片exif信息，暂只支持jpeg
 * @param {*} file 
 */
export function getImagePx (file) {
  return new Promise(resolve => {
    if (file.type.includes('png')) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const imgDom = new Image()
        imgDom.src = this.result
        imgDom.onload = function () {
          resolve({
            width: this.width,
            height: this.height,
            colorSpace: 'SRGB'
          })
        }
      }
      reader.readAsDataURL(file)
      
    } else {
      EXIF.getData(file, function () {
        const _dataJson = EXIF.getAllTags(this)
        const data = {
          width: _dataJson.PixelXDimension,
          height: _dataJson.PixelYDimension,
          colorSpace: COLOR_SPACE[_dataJson.ColorSpace]
        }
        resolve(data)
      })
    }
  })
}
