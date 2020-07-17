<template>
  <div class="other-config">
    <el-button @click="finalSubmint" type="primary" >提交</el-button>
  </div>
</template>

<script>
import * as uuid from 'uuid'
import { psTypeIdEnum } from '@/model/Enumerate.js'
import * as Product from '@/api/product.js'

export default {
  name: 'OtherConfig',
  components: {},
  props: {
    productSkus: { type: Array, required: true },
    productObj: { type: Object, required: true }
  },
  data() {
    return {
      upgradeForm: {
        name: '',
        thumbnailList: [],
        desc: ''
      }
    }
  },
  methods: {
    /**
     * @description 提交全部数据
     */
    async finalSubmint () {
      const { thumbnailPath, sharePath, isSimple, ...rest } = this.productObj
      let finalObj = rest
      const skuObj = this.handleProductSkus()
      finalObj.thumbnailPath = thumbnailPath[0].path
      finalObj.sharePath = sharePath[0].path
      finalObj.productSkus = skuObj.finalProductSku
      finalObj.skus = skuObj.finalSkus
      await Product.addProduct(finalObj)
    },
    /**
     * @description 提交全部数据
     */
    handleProductSkus () {
      const { productSkus } = this
      let finalProductSku = []
      let finalSkus = {}
      productSkus.forEach((item) => {
        item.styleForm.uuid = uuid.v4() // 给风格item创建uuid
        finalSkus[item.styleForm.uuid] = {
          name: item.styleForm.name,
          type: 's2',
          description: item.styleForm.desc,
          img_path: item.styleForm.thumbnailList[0].path
        }
        if (item.styleForm.isSimple === 'simple') { // 无升级体验的情况
          let styleObj = {}
          let styleSku = []
          if (item.styleForm.priceObj.simplePrice === 'contact') { // 联系客服
            styleObj.handle_account = 1
            styleObj.price = item.styleForm.priceObj.simplePriceText
          } else {
            item.styleForm.priceObj.standerPrice.forEach((standerPriceItem) => {
              this.handleStanderPriceItem(styleObj, standerPriceItem)
              styleSku.push({
                id: psTypeIdEnum[standerPriceItem.type]
              })
            })
          }
          styleSku.push({
            uuid: item.styleForm.uuid
          })
          styleObj.skus = styleSku
          finalProductSku.push(styleObj)
        }
        if (item.styleForm.isSimple === 'notSimple') { // 升级体验存在的情况
          item.upgradeForms.forEach((upgradeItem) => {
            upgradeItem.uuid = uuid.v4() // 给升级item创建uuid
            finalSkus[upgradeItem.uuid] = {
              name: upgradeItem.name,
              type: 's3',
              description: upgradeItem.desc,
              img_path: upgradeItem.thumbnailList[0].path
            }
            let upgradeObj = {}
            let upgradeSku = []
            if (upgradeItem.priceObj.simplePrice === 'contact') { // 联系客服时候
              upgradeObj.handle_account = 1
              upgradeObj.price = upgradeItem.priceObj.simplePriceText
              upgradeSku.push({
                uuid: upgradeItem.uuid
              })
              upgradeSku.push({
                uuid: item.styleForm.uuid
              })
              upgradeObj.skus = upgradeSku
              finalProductSku.push(upgradeObj)
            } else { // 正常价格配置
              upgradeItem.priceObj.standerPrice.forEach((standerPriceItem) => {
                upgradeObj = {}
                upgradeSku = []
                this.handleStanderPriceItem(upgradeObj, standerPriceItem)
                upgradeSku.push({
                  id: psTypeIdEnum[standerPriceItem.type]
                })
                upgradeSku.push({
                  uuid: upgradeItem.uuid
                })
                upgradeSku.push({
                  uuid: item.styleForm.uuid
                })
                upgradeObj.skus = upgradeSku
                finalProductSku.push(upgradeObj)
              })
            }
          })
        }
      })
      return {
        finalProductSku,
        finalSkus
      }
    },
    /**
     * @description 处理修图标准的数据
     */
    handleStanderPriceItem (aimObj, dataObj) {
      aimObj.handle_account = 0
      aimObj.price = dataObj.price
      aimObj.price_extend = {
        stepPrice: dataObj.stepPrice,
        basePeople: dataObj.basePeople,
        limitPeople: dataObj.limitPeople
      }
    }
  }
}
</script>
