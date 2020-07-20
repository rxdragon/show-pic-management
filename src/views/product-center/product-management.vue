<template>
  <div class="container">
    <product-list />
    <div class="config-area">
      <el-tabs v-model="whichStep">
        <el-tab-pane v-for="(item, index) in tabPaneConfig" :key="index" :label="item.label" :name="item.name" />
      </el-tabs>
      <div
        class="module-panel"
        :class="{'no-border': whichStep === 'ProductConfig'}"
      >
        <component
          :create-info="createInfo"
          :product-skus="productSkus"
          :product-obj="productObj"
          @next="goNext"
          :is="step"
        />
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
// const mock = 
export default {
  name: 'ProductManagement',
  components: { ProductList,ProductConfig,SubCategoryConfigCreate, SubCategoryConfigEdit, DetailConfig, OtherConfig },
  data () {
    return {
      tabPaneConfig,
      whichStep: 'ProductConfig',
      isCreate: false,
      productObj: {
        name: '',
        description: '',
        thumbnailPath: [],
        sharePath: [],
        startAt: '',
        endAt: '',
        coverPath: [],
        information: '111',
        isSimple: 'notSimple',
        cloudRetouchRequire: ''
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
