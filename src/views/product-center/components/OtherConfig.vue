<template>
  <div class="other-config">
    <div class="panel-title">时间配置</div>
    <div class="config-item">
      <span class="title">上线时间:</span>
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="productObj.startAt" type="datetime" placeholder="选择上线时间"></el-date-picker>
    </div>
    <div class="config-item">
      <span class="title">下线时间:</span>
      <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="productObj.endAt" type="datetime" placeholder="选择下线时间"></el-date-picker>
    </div>
    <div class="module-box">
      <div class="panel-title">云端产品审核信息</div>
      <el-form ref="productObj" :model="productObj" :rules="otherRules" label-width="150px">
        <el-form-item label="修图要求:" prop="cloudRetouchRequire">
          <el-input
            type="textarea"
            class="submit-textarea"
            placeholder="请填写修图要求,该修图要求将在云端产品审核时使用"
            v-model="productObj.cloudRetouchRequire"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-box">
      <el-button @click="finalSubmint" type="primary" >提交</el-button>
    </div>
  </div>
</template>

<script>
import { psTypeIdEnum } from '@/model/Enumerate.js'
import * as Product from '@/api/product.js'

const otherRules = {
  cloudRetouchRequire: [
    { required: true, message: '请填写修图要求,该修图要求将在云端产品审核时使用', trigger: 'blur' }
  ]
}

export default {
  name: 'OtherConfig',
  components: {},
  props: {
    productObj: { type: Object, required: true },
    productSkus: { type: Array, required: true }
  },
  data() {
    return {
      otherRules,
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
      const { thumbnailPath, sharePath, isSimple, coverPath, ...rest } = this.productObj
      let finalObj = rest
      const skuObj = this.handleProductSkus()
      finalObj.thumbnailPath = thumbnailPath[0].path
      finalObj.sharePath = sharePath[0].path
      finalObj.coverPath = coverPath[0].path
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
<style lang="less" scoped>
.other-config {
  .config-item {
    margin-bottom: 24px;

    .title {
      margin-right: 12px;
      font-size: 14px;
      font-weight: 700;
      color: #303133;
    }
  }

  .panel-title {
    margin-bottom: 20px;
  }

  .submit-textarea {
    width: 600px;
  }

  .submit-box {
    text-align: center;
  }
}
</style>
