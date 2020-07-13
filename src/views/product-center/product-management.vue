<template>
  <div class="container">
    <product-list></product-list>
    <div class="config-area">
      <el-tabs v-model="whichStep" :before-leave="beforeLeave">
        <el-tab-pane label="产品配置" name="productConfig"></el-tab-pane>
        <el-tab-pane label="子品类配置" name="subCategoryConfig"></el-tab-pane>
        <el-tab-pane label="详情页配置" name="detailConfig"></el-tab-pane>
        <el-tab-pane label="其他配置" name="otherConfig"></el-tab-pane>
      </el-tabs>
      <product-config v-show="whichStep === 'productConfig'"></product-config>
    </div>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ProductConfig from './components/ProductConfig.vue'

export default {
  name: 'ProductManagement',
  components: { ProductList,ProductConfig },
  data () {
    return {
      whichStep: 'productConfig',
    }
  },
  methods: {
    /**
     * @description 阻止点击切换
     */
    beforeLeave () {
      return false
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
    margin-left: 10px;
  }
}
</style>
