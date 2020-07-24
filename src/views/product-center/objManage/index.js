import * as uuid from 'uuid'
import { productPriceStatusEnum, productIsSimpleEnum } from '@/model/Enumerate.js'

export class StyleObj { // 风格的item
  uuid = uuid.v4()
  name = ''
  thumbnailList = []
  desc = ''
  isSimple = productIsSimpleEnum.NOTSIMPLE
  priceObj = {
    simplePriceText: '',
    simplePrice: productPriceStatusEnum.NORMAL,
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
    simplePrice: productPriceStatusEnum.NORMAL,
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
  isSimple = productIsSimpleEnum.NOTSIMPLE
  cloudRetouchRequire = ''
  priceObj = { // 只有大师和普通修图时候的价格存储
    simplePriceText: '',
    simplePrice: productPriceStatusEnum.NORMAL,
    standerPrice: [],
    psStandard: []
  }
}
