<template>
  <div class="container">
    <product-list ref="productList" @selectProduct="selectProduct" @addProduct="addProduct" />
    <div class="config-area">
      <el-tabs v-model="whichStep">
        <el-tab-pane v-for="(item, index) in tabPaneConfig" :key="index" :label="item.label" :name="item.name" />
      </el-tabs>
      <div
        class="module-panel"
        :class="{'no-border': whichStep === 'ProductConfig'}"
      >
        <keep-alive>
          <component
            :create-info="createInfo"
            :product-skus="productSkus"
            :product-obj="productObj"
            @next="goNext"
            :is="step"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ProductConfig from './components/ProductConfig.vue'
import SubCategoryConfigCreate from './components/SubCategoryConfigCreate.vue'
import SubCategoryConfigEdit from './components/SubCategoryConfigEdit.vue'
import DetailConfig from './components/DetailConfig.vue'
import OtherConfig from './components/OtherConfig.vue'
import { psTypeNameEnum, psIdTypeEnum } from '@/model/Enumerate.js'
import { ProductObj } from './objManage/index.js'
import * as Product from '@/api/product.js'

const tabPaneConfig = [
  {
    name: 'ProductConfig',
    label: '基础设置'
  },
  {
    name: 'SubCategoryConfig',
    label: '子品类配置'
  },
  {
    name: 'DetailConfig',
    label: '详情页配置'
  },
  {
    name: 'OtherConfig',
    label: '其他配置'
  }
]

export default {
  name: 'ProductManagement',
  components: { ProductList,ProductConfig,SubCategoryConfigCreate, SubCategoryConfigEdit, DetailConfig, OtherConfig },
  data () {
    return {
      tabPaneConfig,
      whichStep: 'ProductConfig',
      isCreate: false,
      productObj: new ProductObj(),
      productSkus: [], // 存放配置保存的子品类
      createInfo: {
        isNew: true,
        index: ''
      }
    }
  },
  computed: {
    step () {
      let finalStep = this.whichStep
      if (finalStep === 'SubCategoryConfig') {
        finalStep = this.isCreate ? 'SubCategoryConfigCreate' : 'SubCategoryConfigEdit'
      }
      return finalStep
    }
  },
  methods: {
    /**
     * @description 下一步
     */
    goNext (obj) {
      if (obj.type === 'create') { // 改成编辑模式
        this.isCreate = false
        // 如果有配置传出,判断是新增还是编辑 
        if (obj.styleForm && obj.isNew) { // 新增
          let tempObj = {}
          tempObj.styleForm = obj.styleForm
          tempObj.upgradeForms = obj.upgradeForms
          this.productSkus.push(tempObj)
        }
        if (obj.styleForm && !obj.isNew) { // 编辑
          let tempObj = {}
          tempObj.styleForm = obj.styleForm
          tempObj.upgradeForms = obj.upgradeForms
          this.productSkus[obj.index] = tempObj
        }
      }
      if (obj.type === 'edit') { // 改成新增模式
        this.isCreate = true
        if (obj.isNew) {
          this.createInfo = {
            isNew: true,
          }
          return
        }
        this.createInfo = {
          isNew: false,
          index: obj.index
        }
      }
      if (obj.type === 'init') { // 提交后重置
        this.addProduct()
        this.$refs.productList.init()
      }
      if (!obj.type) {
        this.whichStep = obj.aim
      }
    },
    /**
     * @description 初始化
     */
    resetData () {
      this.productObj = new ProductObj()
      this.productSkus = []
      this.whichStep = 'ProductConfig'
      this.isCreate = false
    },
    /**
     * @description 新建产品
     */
    addProduct () {
      this.resetData()
    },
    /**
     * @description 选择产品编辑
     */
    async selectProduct (obj) {
      this.resetData()
      const req = { id: obj.id }
      const msg = await Product.getInfo(req)
      this.handleEditorInfo(msg)
      this.productObj.editType = 'edit' // 标记为已有产品的编辑状态
    },
    /**
     * @description 处理成编辑状态的信息
     */
    handleEditorInfo (msg) {
      const { id, tree, product_sku: productSku, name, description, thumbnail_path: thumbnailPath, share_path: sharePath, start_at: startAt, end_at: endAt, cover_path: coverPath, information, extend, handle_account: handleAccount, price } = msg
      let tempProductSku = []
      let arrayS2 = []
      let arrayS1 = []
      let productObj = {
        id,
        name,
        description,
        thumbnailPath: [{
          path: thumbnailPath,
          status: 'success',
          response: {}
        }],
        sharePath: [{
          path: sharePath,
          status: 'success',
          response: {}
        }],
        startAt,
        endAt,
        coverPath: [{
          path: coverPath,
          status: 'success',
          response: {}
        }],
        information,
        cloudRetouchRequire: extend ? extend.cloud_retouch_require : '',
        isSimple: 'notSimple'
      }
      tree.forEach((item) => {
        if (item.k_s === 's2') {
          arrayS2 = item.v
        }
        if (item.k_s === 's1') {
          arrayS1 = item.v
        }
      })
      // 如果handleAccount存在说明是没有风格设置且没有修图标准的联系客服
      if (handleAccount) {
        productObj.isSimple = 'simple'
        productObj.priceObj = {
          simplePrice: 'contact',
          simplePriceText: price,
          productId: id
        }
        this.productObj = productObj
        this.productSkus = []
        return
      }
      if (!arrayS2.length && arrayS1.length) { // 只有修图标准的情况
        productObj.isSimple = 'simple'
        productObj.priceObj = this.handlePriceObjS1(productSku)
        this.productObj = productObj
        this.productSkus = []
        return
      }
      arrayS2.forEach((item) => {
        const { id, description, img_path: imgPath, name, sku_child } = item
        let upgradeForms = []
        let styleForm = {
          uuid: id,
          name,
          desc: description,
          thumbnailList: [{
            path: imgPath,
            status: 'success',
            response: {}
          }],
        }
        if (sku_child) { // 是否有升级体验
          styleForm.isSimple = 'notSimple'
          sku_child.v.forEach((item) => {
            upgradeForms.push(this.handleUpgradeObj(item, productSku, 's3'))
          })
        } else {
          styleForm.isSimple = 'simple'
          styleForm.priceObj = this.handlePriceObj(productSku, id, 's2')
        }
        tempProductSku.push({
          styleForm,
          upgradeForms
        })
      })
      this.productObj = productObj
      this.productSkus = tempProductSku
    },
    /**
     * @description 处理升级体验部分
     */
    handleUpgradeObj (itemS3, productSku, type) {
      const { id, description, img_path: imgPath, name } = itemS3
      let upgradeObj = {
        uuid: id,
        name,
        desc: description,
        thumbnailList: [{
          path: imgPath,
          status: 'success',
          response: {}
        }]
      }
      upgradeObj.priceObj = this.handlePriceObj(productSku, id, type)
      return upgradeObj
    },
    /**
     * @description 处理价格部分
     */
    handlePriceObj (productSku, styleId, type) {
      let simplePriceText = ''
      let simplePrice = 'normal'
      let productId = ''
      let standerPrice = []
      let psStandard = []

      productSku.forEach((item) => {
        let standerPriceObj = {}
        if (item.skus[type] === styleId) {
          if (item.handle_account) { // 联系客服
            simplePrice = 'contact'
            simplePriceText = item.price
            productId = item.id
          } else {
            const psType = psIdTypeEnum[item.skus.s1]
            const { basePeople, limitPeople, stepPrice } = item.price_extend
            standerPriceObj.price = item.price
            standerPriceObj.type = psType
            standerPriceObj.name = psTypeNameEnum[psType]
            standerPriceObj.basePeople = basePeople
            standerPriceObj.limitPeople = limitPeople
            standerPriceObj.stepPrice = stepPrice
            standerPriceObj.productId = item.id
            standerPrice.push(standerPriceObj)
            psStandard.push(psType)
          }
        }
      })
      return {
        simplePriceText,
        simplePrice,
        standerPrice,
        productId,
        psStandard
      }
    },
    /**
     * @description 处理成编辑状态的信息
     */
    handlePriceObjS1 (productSku) {
      let simplePriceText = ''
      let simplePrice = 'normal'
      let standerPrice = []
      let productId = ''
      let psStandard = []
      productSku.forEach((item) => {
        let standerPriceObj = {}
        if (item.handle_account) { // 联系客服
          simplePrice = 'contact'
          simplePriceText = item.price
          productId = item.id
        } else {
          const psType = psIdTypeEnum[item.skus.s1]
          const { basePeople, limitPeople, stepPrice } = item.price_extend
          standerPriceObj.type = psType
          standerPriceObj.price = item.price
          standerPriceObj.name = psTypeNameEnum[psType]
          standerPriceObj.basePeople = basePeople
          standerPriceObj.limitPeople = limitPeople
          standerPriceObj.stepPrice = stepPrice
          standerPriceObj.productId = item.id
          standerPrice.push(standerPriceObj)
          psStandard.push(psType)
        }
      })
      return {
        simplePriceText,
        simplePrice,
        standerPrice,
        productId,
        psStandard
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  margin-top: 20px;

  .config-area {
    width: 100%;
    margin-left: 20px;
  }

  /deep/ .el-tabs__item {
    &.is-disabled {
      color: black;
    }
  }
}
</style>
