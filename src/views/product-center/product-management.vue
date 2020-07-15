<template>
  <div class="container">
    <product-list></product-list>
    <div class="config-area">
      <el-tabs v-model="whichStep" @tab-click="tabClick">
        <el-tab-pane disabled label="基础设置" name="ProductConfig"></el-tab-pane>
        <el-tab-pane disabled label="子品类配置" name="SubCategoryConfig"></el-tab-pane>
        <el-tab-pane disabled label="详情页配置" name="DetailConfig"></el-tab-pane>
        <el-tab-pane disabled label="其他配置" name="OtherConfig"></el-tab-pane>
      </el-tabs>
      <keep-alive>
        <component  @next="goNext" :is="whichStep"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue'
import ProductConfig from './components/ProductConfig.vue'
import SubCategoryConfig from './components/SubCategoryConfig.vue'

export default {
  name: 'ProductManagement',
  components: { ProductList,ProductConfig,SubCategoryConfig },
  data () {
    return {
      whichStep: 'productConfig',
    }
  },
  methods: {
    tabClick() {
      return false
    },
    /**
     * @description 下一步
     */
    goNext (obj) {
      this.whichStep = obj.aim
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

  /deep/ .el-tabs__item {
    &.is-disabled {
      color: black;
    }
  }
}
</style>
