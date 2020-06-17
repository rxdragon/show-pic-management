import QRCode from 'qrcode'

/**
 * @description 导出二维码图片
 * @param {*} url 
 */
export default function getQRcode (url) {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(url, function (error, url) {
      if (error) reject(error)
      resolve(url)
    })
  })
}
