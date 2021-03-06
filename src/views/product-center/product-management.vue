<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :xl="4" :lg="6" >
        <product-list ref="productList" @selectProduct="selectProduct" @addProduct="addProduct" />
      </el-col>
      <el-col v-if="showInit" :xl="16" :lg="18">
        <div class="config-area">
          <el-tabs v-model="whichStep">
            <el-tab-pane v-for="(item, index) in tabPaneConfig" :key="index" :label="item.label" :name="item.name" />
          </el-tabs>
          <div
            class="module-panel"
            :class="{'no-border': whichStep === 'ProductConfig'}"
          >
            <keep-alive exclude="SubCategoryConfigEdit">
              <component
                :create-info="createInfo"
                :product-skus="productSkus"
                :product-obj="productObj"
                :check-status="checkStatus"
                @next="goNext"
                :is="step"
                @finalCheck="modifyCheckStatus"
                :ref="step"
              />
            </keep-alive>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ProductConfig from './components/ProductConfig.vue'
import SubCategoryConfigCreate from './components/SubCategoryConfigCreate.vue'
import SubCategoryConfigEdit from './components/SubCategoryConfigEdit.vue'
import DetailConfig from './components/DetailConfig.vue'
import OtherConfig from './components/OtherConfig.vue'

import { psTypeNameEnum, psIdTypeEnum, PRODUCT_PRICE_STATUS, PRODUCT_IS_SIMPLE } from '@/model/Enumerate.js'
import { ProductObj, CheckStatusObj } from './objManage/index.js'

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
      showInit: false, // 控制右侧编辑区展示隐藏,提交后隐藏,初始状态隐藏
      whichStep: 'ProductConfig',
      isCreate: false,
      productObj: new ProductObj(),
      productSkus: [], // 存放配置保存的子品类
      createInfo: {
        isNew: true, // 判断页面是新建的还是编辑老的
        index: '',
        needInit: true // 控制新建页面是否需要初始化
      },
      checkStatus: new CheckStatusObj() // 用于存放最终校验失败的模块, 被对应模块重新校验后消耗掉
    }
  },
  computed: {
    step () {
      let finalStep = this.whichStep
      if (finalStep === 'SubCategoryConfig') finalStep = this.isCreate ? 'SubCategoryConfigCreate' : 'SubCategoryConfigEdit'
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
          const tempObj = {}
          tempObj.styleForm = obj.styleForm
          tempObj.upgradeForms = obj.upgradeForms
          this.productSkus.push(tempObj)
        }
        if (obj.styleForm && !obj.isNew) { // 编辑
          const tempObj = {}
          tempObj.styleForm = obj.styleForm
          tempObj.upgradeForms = obj.upgradeForms
          this.productSkus[obj.index] = tempObj
        }
      }
      if (obj.type === 'edit') { // 改成新增模式
        this.isCreate = true
        if (obj.isNew) { // 新建一个风格
          this.createInfo = {
            isNew: true,
            index: '',
            needInit: true
          }
          return
        }
        this.createInfo = { // 编辑一个现有的风格
          isNew: false,
          index: obj.index,
          needInit: true
        }
      }
      if (obj.type === 'noNeedInit') { // 页面初始化后,将needInit改为false,下次需要初始化再主动触发
        this.createInfo.needInit = false
      }
      if (obj.type === 'init') { // 提交后重置
        this.showInit = false
        this.resetData()
        this.$refs.productList.init()
      }
      if (obj.type === 'emptySubCategory') { // 清空子品类
        this.productSkus = []
        this.isCreate = false
      }
      if (!obj.type) {
        this.whichStep = obj.aim
        document.getElementsByClassName('app-main')[0].scrollTop = 0
      }
    },
    /**
     * @description 初始化
     */
    resetData () {
      this.productObj = new ProductObj()
      this.checkStatus = new CheckStatusObj()
      this.productSkus = []
      this.whichStep = 'ProductConfig'
      this.isCreate = false // 转成子品类编辑页
      this.createInfo.needInit = true // 初始化数据都需要子品类初始化
      if (!this.showInit) return // 编辑区不展示的时候不需要校验
      this.$nextTick(() => {
        this.$refs.ProductConfig.resetCheck()
      })

    },
    /**
     * @description 新建产品
     */
    async addProduct () {
      if (this.showInit) {
        await this.$confirm('当前操作未保存，刷新页面后数据将不做保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
      this.showInit = true
      this.resetData()
    },
    /**
     * @description 选择产品编辑
     */
    async selectProduct (obj) {
      if (this.showInit) {
        await this.$confirm('当前操作未保存，刷新页面后数据将不做保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
      this.showInit = true
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
      const tempProductSku = []
      let styleArray = []
      let psStandardArray = []
      const productObj = {
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
        isSimple: PRODUCT_IS_SIMPLE.NOTSIMPLE,
        priceObj: {
          simplePrice: PRODUCT_PRICE_STATUS.NORMAL,
          simplePriceText: '',
          standerPrice: [],
          psStandard: []
        }
      }
      tree.forEach(treeItem => {
        if (treeItem.k_s === 's2') styleArray = treeItem.v
        if (treeItem.k_s === 's1') psStandardArray = treeItem.v
      })
      // 如果handleAccount存在说明是没有风格设置且没有修图标准的联系客服
      if (handleAccount) {
        productObj.isSimple = PRODUCT_IS_SIMPLE.SIMPLE
        productObj.priceObj = {
          simplePrice: PRODUCT_PRICE_STATUS.CONTACT,
          simplePriceText: price,
          productId: id,
          standerPrice: [],
          psStandard: []
        }
        this.productObj = productObj
        this.productSkus = []
        return
      }
      if (!styleArray.length && psStandardArray.length) { // 只有修图标准的情况
        productObj.isSimple = PRODUCT_IS_SIMPLE.SIMPLE
        productObj.priceObj = this.handlePriceObjS1(productSku)
        this.productObj = productObj
        this.productSkus = []
        return
      }
      styleArray.forEach(styleArrayItem => {
        const { id, description, img_path: imgPath, name, sku_child } = styleArrayItem
        const upgradeForms = []
        const styleForm = {
          uuid: id,
          name,
          desc: description,
          thumbnailList: [],
        }
        if (imgPath) {
          styleForm.thumbnailList.push({
            path: imgPath,
            status: 'success',
            response: {}
          })
        }
        if (sku_child) { // 是否有升级体验
          styleForm.isSimple = PRODUCT_IS_SIMPLE.NOTSIMPLE
          styleForm.priceObj = {
            simplePrice: 'normal',
            simplePriceText: '',
            standerPrice: [],
            psStandard: []
          }
          sku_child.v.forEach(skuChildItem => {
            upgradeForms.push(this.handleUpgradeObj(skuChildItem, productSku, 's3'))
          })
        } else {
          styleForm.isSimple = PRODUCT_IS_SIMPLE.SIMPLE
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
      const upgradeObj = {
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
      let simplePrice = PRODUCT_PRICE_STATUS.NORMAL
      let productId = ''
      const standerPrice = []
      const psStandard = []

      productSku.forEach(skuItem => {
        const standerPriceObj = {}
        if (skuItem.skus[type] !== styleId) return
        if (skuItem.handle_account) { // 联系客服
          simplePrice = PRODUCT_PRICE_STATUS.CONTACT
          simplePriceText = skuItem.price
          productId = skuItem.id
        } else {
          const psType = psIdTypeEnum[skuItem.skus.s1]
          const { basePeople, limitPeople, stepPrice } = skuItem.price_extend
          standerPriceObj.price = skuItem.price
          standerPriceObj.type = psType
          standerPriceObj.name = psTypeNameEnum[psType]
          standerPriceObj.basePeople = basePeople
          standerPriceObj.limitPeople = limitPeople
          standerPriceObj.stepPrice = stepPrice
          standerPriceObj.productId = skuItem.id
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
    },
    /**
     * @description 处理成编辑状态的信息
     */
    handlePriceObjS1 (productSku) {
      let simplePriceText = ''
      let simplePrice = PRODUCT_PRICE_STATUS.NORMAL
      const standerPrice = []
      let productId = ''
      const psStandard = []
      productSku.forEach(skuItem => {
        const standerPriceObj = {}
        if (skuItem.handle_account) { // 联系客服
          simplePrice = PRODUCT_PRICE_STATUS.CONTACT
          simplePriceText = skuItem.price
          productId = skuItem.id
        } else {
          const psType = psIdTypeEnum[skuItem.skus.s1]
          const { basePeople, limitPeople, stepPrice } = skuItem.price_extend
          standerPriceObj.type = psType
          standerPriceObj.price = skuItem.price
          standerPriceObj.name = psTypeNameEnum[psType]
          standerPriceObj.basePeople = basePeople
          standerPriceObj.limitPeople = limitPeople
          standerPriceObj.stepPrice = stepPrice
          standerPriceObj.productId = skuItem.id
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
    },
    /**
     * @description 处理检查的队列
     */
    modifyCheckStatus (modifyObj) {
      const { type, tab } = modifyObj
      this.checkStatus[tab] = type === 'add'
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  min-width: 900px;
  margin-top: 20px;

  .el-row {
    width: 100%;
  }

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
