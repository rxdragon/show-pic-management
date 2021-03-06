<template>
  <div class="other-config">
    <div v-if="productObj.editType === 'edit'">
      <div class="config-item">
        <span class="title">上线时间:</span>
        <el-radio-group @change="selectOnline" v-model="editOnline">
          <el-radio label="fixed">
            固定时间
            <el-date-picker
              clearable
              :picker-options="pickerOptions"
              v-model="productObj.startAt"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择上线时间"
            />
          </el-radio>
          <el-radio label="now">立即上线</el-radio>
        </el-radio-group>
      </div>
      <div class="config-item">
        <span class="title">下线时间:</span>
        <el-radio-group @change="selectOffline" v-model="editOffline">
          <el-radio label="fixed">
            固定时间
            <el-date-picker
              clearable
              :picker-options="pickerOptions"
              v-model="productObj.endAt"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择下线时间"
            />
          </el-radio>
          <el-radio label="now">立即下线</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div v-else>
      <div class="config-item">
        <span class="title">上线时间:</span>
        <el-date-picker
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="productObj.startAt"
          type="datetime"
          placeholder="选择上线时间"
          :picker-options="pickerOptions"
        />
      </div>
      <div class="config-item">
        <span class="title">下线时间:</span>
        <el-date-picker
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="productObj.endAt"
          type="datetime"
          placeholder="选择下线时间"
          :picker-options="pickerOptions"
        />
      </div>
    </div>
    <div class="module-box" v-if="productObj.editType !== 'edit'">
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
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-box">
      <el-button @click="finalSubmint" type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
import { psTypeIdEnum, PRODUCT_PRICE_STATUS, PRODUCT_IS_SIMPLE } from '@/model/Enumerate.js'
import * as Product from '@/api/product.js'
import Tool from '../tools/index.js'

const otherRules = {
  cloudRetouchRequire: [
    { required: true, message: '请填写修图要求,该修图要求将在云端产品审核时使用', trigger: ['blur', 'change'] }
  ]
}

export default {
  name: 'OtherConfig',
  components: {},
  props: {
    productObj: { type: Object, required: true },
    productSkus: { type: Array, required: true },
    createInfo: { type: Object, required: true }
  },
  data () {
    return {
      otherRules,
      editOnline: 'fixed',
      editOffline: 'fixed',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  activated () {
    if (this.createInfo.needInit) {
      this.resetData()
    }
  },
  methods: {
    /**
     * @description 提交全部数据
     */
    finalSubmint () {
      if (!this.checkAll()) return
      const { endAt, startAt, editType,thumbnailPath, priceObj, sharePath, isSimple, coverPath, id, cloudRetouchRequire, ...rest } = this.productObj
      const finalObj = rest
      const skuObj = this.handleProductSkus()
      finalObj.thumbnailPath = thumbnailPath[0] && thumbnailPath[0].path
      finalObj.sharePath = sharePath[0] && sharePath[0].path
      finalObj.coverPath = coverPath[0] && coverPath[0].path
      if (endAt) finalObj.endAt = endAt
      if (startAt) finalObj.startAt = startAt
      finalObj.handle_account = 0 // 有升级项
      if (skuObj.finalProductSku.length) {
        finalObj.productSkus = skuObj.finalProductSku
      } else { // 基础设置联系客服,不传productSkus,但是外层要传handle_account和price
        finalObj.handle_account = skuObj.styleObj.handle_account
        finalObj.price = skuObj.styleObj.price
      }
      finalObj.extend = { cloud_retouch_require: cloudRetouchRequire }
      if (skuObj.finalSkus) finalObj.skus = skuObj.finalSkus
      if (editType === 'edit') { // 编辑状态下,判断有没有立马上下线
        if (this.editOnline === 'now') finalObj.state = 'online'
        if (this.editOffline === 'now') finalObj.state = 'offline'
      }
      this.fetchSubmit(id, finalObj)
    },
    /**
     * @description 提交请求
     */
    async fetchSubmit (id, finalObj) {
      if (id) {
        finalObj.id = id
        await Product.edit(finalObj)
      } else {
        await Product.addProduct(finalObj)
      }
      this.$newMessage.success('提交成功')
      this.$emit('next', { type: 'init' })
    },
    /**
     * @description 处理全部sku相关数据
     */
    handleProductSkus () {
      // 单层产品配置,走另一个逻辑
      if (this.productObj.isSimple === PRODUCT_IS_SIMPLE.SIMPLE) return this.handleSimpleSkus()
      const { productSkus } = this
      const finalProductSku = []
      const finalSkus = {}
      productSkus.forEach(skuItem => {
        finalSkus[skuItem.styleForm.uuid] = {
          name: skuItem.styleForm.name,
          type: 's2',
          description: skuItem.styleForm.desc,
          img_path: skuItem.styleForm.thumbnailList[0].path
        }
        if (skuItem.styleForm.isSimple === PRODUCT_IS_SIMPLE.SIMPLE) this.handleNoUpgrade(skuItem, finalProductSku) // 无升级体验的情况
        if (skuItem.styleForm.isSimple === PRODUCT_IS_SIMPLE.NOTSIMPLE) this.handleHasUpgrade(skuItem, finalProductSku, finalSkus) // 升级体验存在的情况
      })
      return {
        finalProductSku,
        finalSkus
      }
    },
    /**
     * @description 处理单层产品的特殊情况
     */
    handleSimpleSkus () {
      const finalProductSku = []
      const styleObj = {}
      if (this.productObj.priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) { // 联系客服 不用传product_sku
        styleObj.handle_account = 1
        styleObj.price = this.productObj.priceObj.simplePriceText
      } else {
        this.productObj.priceObj.standerPrice.forEach(standerPriceItem => {
          const normalObj = {}
          const normalSku = []
          this.handleStanderPriceItem(normalObj, standerPriceItem)
          normalSku.push({
            id: psTypeIdEnum[standerPriceItem.type]
          })
          normalObj.skus = normalSku
          finalProductSku.push(normalObj)
        })
      }
      return {
        finalProductSku,
        styleObj
      }
    },
    /**
     * @description 处理只有风格没有升级体验的情况
     */
    handleNoUpgrade (skuItem, finalProductSku) {
      if (skuItem.styleForm.priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) { // 联系客服
        const styleObj = {}
        const styleSku = []
        styleObj.handle_account = 1
        styleObj.price = skuItem.styleForm.priceObj.simplePriceText
        if (skuItem.styleForm.priceObj.productId) styleObj.id = skuItem.styleForm.priceObj.productId
        styleSku.push({ uuid: skuItem.styleForm.uuid })
        styleObj.skus = styleSku
        finalProductSku.push(styleObj)
      } else {
        skuItem.styleForm.priceObj.standerPrice.forEach(standerPriceItem => {
          const styleObj = {}
          const styleSku = []
          this.handleStanderPriceItem(styleObj, standerPriceItem)
          styleSku.push({ id: psTypeIdEnum[standerPriceItem.type] })
          styleSku.push({ uuid: skuItem.styleForm.uuid })
          styleObj.skus = styleSku
          finalProductSku.push(styleObj)
        })
      }
    },
    /**
     * @description 处理有升级体验的情况
     */
    handleHasUpgrade (skuItem, finalProductSku, finalSkus) {
      skuItem.upgradeForms.forEach(upgradeItem => {
        finalSkus[upgradeItem.uuid] = {
          name: upgradeItem.name,
          type: 's3',
          description: upgradeItem.desc,
          img_path: upgradeItem.thumbnailList[0].path
        }
        if (upgradeItem.priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) { // 联系客服时候
          const upgradeObj = {}
          const upgradeSku = []
          upgradeObj.handle_account = 1
          upgradeObj.price = upgradeItem.priceObj.simplePriceText
          if (upgradeItem.priceObj.productId) upgradeObj.id = upgradeItem.priceObj.productId
          upgradeSku.push({ uuid: upgradeItem.uuid })
          upgradeSku.push({ uuid: skuItem.styleForm.uuid })
          upgradeObj.skus = upgradeSku
          finalProductSku.push(upgradeObj)
        } else { // 正常价格配置
          upgradeItem.priceObj.standerPrice.forEach(standerPriceItem => {
            const upgradeObj = {}
            const upgradeSku = []
            this.handleStanderPriceItem(upgradeObj, standerPriceItem)
            upgradeSku.push({ id: psTypeIdEnum[standerPriceItem.type] })
            upgradeSku.push({ uuid: upgradeItem.uuid })
            upgradeSku.push({ uuid: skuItem.styleForm.uuid })
            upgradeObj.skus = upgradeSku
            finalProductSku.push(upgradeObj)
          })
        }
      })
    },
    /**
     * @description 处理修图标准的数据
     */
    handleStanderPriceItem (aimObj, dataObj) {
      if (dataObj.productId) aimObj.id = dataObj.productId
      aimObj.handle_account = 0
      aimObj.price = dataObj.price
      aimObj.price_extend = {
        stepPrice: dataObj.stepPrice,
        basePeople: dataObj.basePeople,
        limitPeople: dataObj.limitPeople
      }
    },
    /**
     * @description 检查所有情况
     */
    checkAll () {
      // 检查基础设置
      if (!this.checkProductConfig()) {
        this.$newMessage.warning('基础设置还有未填内容')
        this.$emit('finalCheck', {
          type: 'add',
          tab: 'ProductConfig'
        })
        return false
      }
      // 检查子品类设置
      if (!this.checkSubCategoryConfig()) {
        this.$emit('finalCheck', {
          type: 'add',
          tab: 'SubCategoryConfigEdit'
        })
        return false
      }
      // 检查详情页设置
      if (!this.checkDetailConfig()) {
        this.$newMessage.warning('详情设置还有未填内容')
        this.$emit('finalCheck', {
          type: 'add',
          tab: 'DetailConfig'
        })
        return false
      }
      // 检查其他页设置
      if (!this.checkOtherConfig()) return false
      return true
    },
    /**
     * @description 检查基础设置
     */
    checkProductConfig () {
      const { name, description, thumbnailPath, sharePath, isSimple, priceObj } = this.productObj
      const checkArr = [name, description, thumbnailPath.length, sharePath.length] // 校验为空的内容
      if (isSimple === PRODUCT_IS_SIMPLE.SIMPLE && priceObj.simplePrice === PRODUCT_PRICE_STATUS.CONTACT) { // 联系客服
        checkArr.push(priceObj.simplePriceText)
      }
      if (isSimple === PRODUCT_IS_SIMPLE.SIMPLE && priceObj.simplePrice === PRODUCT_PRICE_STATUS.NORMAL) { // 正常价格
        checkArr.push(priceObj.standerPrice.length)
        priceObj.standerPrice.forEach(standerPriceItem => {
          checkArr.push(String(standerPriceItem.basePeople))
          checkArr.push(String(standerPriceItem.price))
          checkArr.push(String(standerPriceItem.stepPrice))
        })
      }
      const hasEmpty = checkArr.some(item => !item)
      return !hasEmpty
    },
    /**
     * @description 检查子品类设置
     */
    checkSubCategoryConfig () {
      const { isSimple } = this.productObj
      const { productSkus } = this
      if (isSimple === PRODUCT_IS_SIMPLE.NOTSIMPLE && !productSkus.length) {
        this.$newMessage.warning('设置了非单层商品,但是还未添加子品类')
        return false
      }
      const hasNeedUpgrade = productSkus.some(item => item.styleForm.isSimple === PRODUCT_IS_SIMPLE.NOTSIMPLE && !item.upgradeForms.length)
      if (hasNeedUpgrade) {
        this.$newMessage.warning('子品类中存在缺少升级体验的产品')
        return false
      }
      // 编辑时候可能老数据没有缩略图,检查没有缩略图的情况
      if (Tool.checkNoThumbnail(productSkus)) {
        this.$newMessage.warning('子品类中存在缺少缩略图的情况')
        return false
      }
      return true
    },
    /**
     * @description 详情设置
     */
    checkDetailConfig () {
      const { information, coverPath } = this.productObj
      const checkArr = [information, coverPath.length] // 校验为空的内容
      const hasEmpty = checkArr.some(item => !item)
      return !hasEmpty
    },
    /**
     * @description 其他设置
     */
    checkOtherConfig () {
      const { cloudRetouchRequire } = this.productObj
      const endTime = this.productObj.endAt
      const startTime = this.productObj.startAt
      const nowTime = Date.now()
      const onlineNow = this.editOnline === 'now'
      const offlineNow = this.editOffline === 'now'
      // 新建模式下
      if (this.productObj.editType !== 'edit') {
        if (!startTime) {
          this.$newMessage.warning('上线时间没有选择')
          return false
        }
        if (endTime && new Date(endTime).getTime() < new Date(startTime).getTime()) {
          this.$newMessage.warning('下线时间要晚于上线时间')
          return false
        }
      } else { // 编辑下
        if (onlineNow && offlineNow) {
          this.$newMessage.warning('不能同时设置立即上下线')
          return false
        }
        if (onlineNow && endTime && (new Date(endTime).getTime() < nowTime)) {
          this.$newMessage.warning('下线时间要晚于上线时间')
          return false
        }
        if (offlineNow && (nowTime < new Date(startTime).getTime())) {
          this.$newMessage.warning('下线时间要晚于上线时间')
          return false
        }
      }
      if (this.productObj.editType !== 'edit' && !cloudRetouchRequire) {
        this.$newMessage.warning('修图要求没有填写')
        return false
      }
      return true
    },
    /**
     * @description 切换立即下线
     */
    selectOffline (value) {
      if (value === 'now') this.productObj.endAt = ''
    },
    /**
     * @description 切换立即上线
     */
    selectOnline (value) {
      if (value === 'now') this.productObj.startAt = ''
    },
    /**
     * @description 初始化
     */
    resetData () {
      this.editOnline = 'fixed'
      this.editOffline = 'fixed'
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

  .submit-box {
    text-align: center;
  }
}
</style>
