import * as uuid from 'uuid'
import { PRODUCT_PRICE_STATUS, PRODUCT_IS_SIMPLE } from '@/model/Enumerate.js'

export class StyleObj { // 风格的item
  uuid = uuid.v4()
  name = ''
  thumbnailList = []
  desc = ''
  isSimple = PRODUCT_IS_SIMPLE.NOTSIMPLE
  priceObj = {
    simplePriceText: '',
    simplePrice: PRODUCT_PRICE_STATUS.NORMAL,
    standerPrice: [],
    psStandard: []
  }
}

export class UpgradeObj { // 升级体验的item
  uuid = uuid.v4()
  name = ''
  thumbnailList = []
  desc = ''
  priceObj = {
    simplePriceText: '',
    simplePrice: PRODUCT_PRICE_STATUS.NORMAL,
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
  isSimple = PRODUCT_IS_SIMPLE.NOTSIMPLE
  cloudRetouchRequire = ''
  priceObj = { // 只有大师和普通修图时候的价格存储
    simplePriceText: '',
    simplePrice: PRODUCT_PRICE_STATUS.NORMAL,
    standerPrice: [],
    psStandard: []
  }
}
