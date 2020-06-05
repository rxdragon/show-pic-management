import EXIF from 'exif-js'

const COLOR_SPACE = {
  1: 'SRGB',
  65535: 'CMYK'
}

export function getImagePx (file) {
  return new Promise(resolve => {
    EXIF.getData(file, function () {
      const _dataJson = EXIF.getAllTags(this)
      const data = {
        width: _dataJson.PixelXDimension,
        height: _dataJson.PixelYDimension,
        colorSpace: COLOR_SPACE[_dataJson.ColorSpace]
      }
      resolve(data)
    })
  })
}
