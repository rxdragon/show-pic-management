import { PRODUCT_PRICE_STATUS } from '@/model/Enumerate.js'

/**
 * @description 检查是否存在无效的缩略图
 */
const checkNoThumbnail = (productSkus) => {
  let hasNoThumbnail = false
  productSkus.forEach((item) => {
    if (hasNoThumbnail) return
    if (!item.styleForm.thumbnailList.length) hasNoThumbnail = true
    const upgradeNothumbnailList = item.upgradeForms.some((item) => !item.thumbnailList.length)
    if (upgradeNothumbnailList) hasNoThumbnail = true
  })
  return hasNoThumbnail
}
/**
 * @description 找到价格,并返回
 */
const findPrice = (priceObj) => {
  const { simplePrice, simplePriceText, standerPrice } = priceObj
  let priceArr = []
  if (simplePrice === PRODUCT_PRICE_STATUS.CONTACT) {
    priceArr.push(simplePriceText)
  } else {
    standerPrice.forEach(item => {
      priceArr.push(item.price)
    })
  }
  return priceArr
}

export default {
  checkNoThumbnail,
  findPrice
}
