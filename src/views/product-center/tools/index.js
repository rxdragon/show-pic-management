const checkNoThumbnail = (productSkus) => {
  let hasNoThumbnail = false
  productSkus.forEach((item) => {
    if (hasNoThumbnail) {
      return
    }
    if (!item.styleForm.thumbnailList.length) {
      hasNoThumbnail = true
    }
    const upgradeNothumbnailList = item.upgradeForms.some((item) => !item.thumbnailList.length)
    if (upgradeNothumbnailList) {
      hasNoThumbnail = true
    }
  })
  return hasNoThumbnail
}

export default {
  checkNoThumbnail
}
