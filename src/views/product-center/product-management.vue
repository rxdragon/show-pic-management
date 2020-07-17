<template>
  <div class="container">
    <product-list/>
    <div class="config-area">
      <el-tabs v-model="whichStep">
        <el-tab-pane v-for="(item, index) in tabPaneConfig" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <component
        :create-info="createInfo"
        :product-skus="productSkus"
        :product-obj="productObj"
        @next="goNext"
        :is="step"
      />
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

// todo mock数据
// const mock = [{"styleForm": {"name": "定制手绘","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594898011201,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单说明s2","isSimple": "simple","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": [{"type": "blue","name": "普通修图","basePeople": "1","limitPeople": "10","price": "100","stepPrice": "20"}]},"uuid": "0e384505-cc0e-4512-9e3f-40cb56342045"},"upgradeForms": []},{"styleForm": {"name": "结婚登记照手绘","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594898089259,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单说明s2","isSimple": "notSimple","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": []},"uuid": "40b87b59-c51a-40c0-8c07-543445f3c0cd"},"upgradeForms": [{"name": "双喜","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594898101005,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单说明s3","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": [{"type": "blue","name": "普通修图","basePeople": "2","limitPeople": "22","price": "2222","stepPrice": "2"},{"type": "master","name": "大师修图","basePeople": "2","limitPeople": "22","price": "2222","stepPrice": "2"}]},"uuid": "faf5be9e-723b-4f85-b17b-3d33acbbd81a"},{"name": "玫瑰","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594898161212,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单说明s3","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": [{"type": "master","name": "大师修图","basePeople": "2","limitPeople": "10","price": "500","stepPrice": "30"}]},"uuid": "eb5fc5d6-01b9-41c6-bd47-640c69be4341"},{"name": "波斯菊","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594898288328,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单说明s3","priceObj": {"simplePriceText": "4999","simplePrice": "contact","standerPrice": []},"uuid": "f247629a-109d-4af6-8f34-e1ba0f3427a5"}]},{"styleForm": {"name": "鸳鸯照手绘","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594899947170,"raw": "[object File]","response": {"url": "upload_dev/2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/16/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单s2","isSimple": "simple","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": [{"type": "blue","name": "普通修图","basePeople": "2","limitPeople": "11","price": "1111","stepPrice": "22"}]},"uuid": "87982691-3649-4e03-9b9b-5b1159250df1"},"upgradeForms": []},{"styleForm": {"name": "重复手绘","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594955573005,"raw": "[object File]","response": {"url": "upload_dev/2020/07/17/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/17/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "12313","isSimple": "notSimple","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": []}},"upgradeForms": [{"name": "玫瑰","thumbnailList": [{"status": "success","name": "下载.png","size": 89355,"percentage": 100,"uid": 1594955583879,"raw": "[object File]","response": {"url": "upload_dev/2020/07/17/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png"},"path": "2020/07/17/FpdfUYeRu5xmsrZeSBF03tG5PNv6.png","uploadedName": "下载"}],"desc": "下单s3","priceObj": {"simplePriceText": "","simplePrice": "normal","standerPrice": [{"type": "blue","name": "普通修图","basePeople": "2","limitPeople": "11","price": "444","stepPrice": "11"}]}}]}]
export default {
  name: 'ProductManagement',
  components: { ProductList,ProductConfig,SubCategoryConfigCreate, SubCategoryConfigEdit, DetailConfig, OtherConfig },
  data () {
    return {
      tabPaneConfig,
      whichStep: 'OtherConfig',
      isCreate: false,
      productObj: {
        name: '',
        description: '',
        thumbnailPath: [],
        sharePath: [],
        startAt: '2020-07-23 01:59:59',
        coverPath: '1111',
        information: '111',
        isSimple: 'notSimple'
      },
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
      if (!obj.type) {
        this.whichStep = obj.aim
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  display: flex;
  padding: 10px;
  margin-top: 20px;
  background: #fff;
  border-radius: 20px;

  .config-area {
    width: 100%;
    margin-left: 10px;
  }

  /deep/ .el-tabs__item {
    &.is-disabled {
      color: black;
    }
  }
}
</style>
