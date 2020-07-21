import * as uuid from 'uuid'

export class UpgradeObj { // 升级体验的item
  uuid = uuid.v4()
  name = ''
  thumbnailList = []
  desc = ''
  priceObj = {
    simplePriceText: '',
    simplePrice: 'normal',
    standerPrice: [],
    psStandard: []
  }
}

export class ProductObj { // 产品的obj
  name = ''
  description = ''
  thumbnailPath = []
  sharePath = []
  startAt = ''
  endAt = ''
  coverPath = []
  information = ''
  isSimple = 'notSimple'
  cloudRetouchRequire = ''
  priceObj = { // 只有大师和普通修图时候的价格存储
    simplePriceText: '',
    simplePrice: 'normal',
    standerPrice: [],
    psStandard: []
  }
}
