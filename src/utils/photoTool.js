/**
 * @description 处理图片地址
 * @param {String} path 图片地址
 * @param {String} type 系统类型，外包系统相关(bpo)，云端系统相关(cloud)，云学院相关(cschool)，不传默认为：云端
 */
export function handlePicPath (path, type) {
  let resPath = ''
  // 线上环境存储目录
  const prodFilePath = 'upload/'
  // 开发环境存储目录
  const devFilePath = 'upload_dev/'
  resPath = (path.replace(devFilePath, '')).replace(prodFilePath, '')
  return resPath
}

/**
 * @description 截取文件名
 * @param {*} name
 */
export function fileNameFormat (name) {
  const fileName = realName(name)
  const indexPoint = fileName.lastIndexOf('.')
  const returnName = fileName
  return returnName.substring(0, indexPoint)
}

/**
 * @description 文件真实名字
 * @param {*} path 
 */
export function realName (path) {
  const pathArr = path.split('/')
  return pathArr[pathArr.length - 1]
}
