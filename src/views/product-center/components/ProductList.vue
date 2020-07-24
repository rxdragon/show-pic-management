<template>
  <div class="product-list module-panel">
    <div class="panel-title">
      <span class="panel-content">
        产品列表
        <drag-product />
      </span>
      <el-button @click="addProduct" type="primary" size="small">添加产品</el-button>
    </div>
    <div class="search">
      <el-input v-model.trim="searchName" @input="inputTrigger" clearable placeholder="产品名称查询" />
      <product-status-select @change="selectTrigger" />
    </div>
    <div class="list-area">
      <el-tree
        empty-text="当前没有产品,快去配置产品吧"
        ref="tree"
        default-expand-all
        :filter-node-method="filterProduct"
        :data="productList"
        @node-click="selectProduct"
      />
    </div>
  </div>
</template>

<script>
import * as Product from '@/api/product.js'
import ProductStatusSelect from '@selectBox/ProductStatusSelect'
import DragProduct from '@/components/DragProduct'

export default {
  name: 'ProductList',
  components: { ProductStatusSelect, DragProduct },
  props: {},
  data() {
    return {
      productList: [],
      searchName: '',
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * @description 获取产品列表
     */
    async searchProductList () {
      const list = await Product.getProductList()
      this.productList = list
    },
    /**
     * @description 初始化
     */
    init () {
      this.searchProductList()
    },
    /**
     * @description 筛选                    
     */
    filterProduct (filterObj, data) {
      if (!filterObj.value) return true
      if (filterObj.type === 'text') {
        return data.label.indexOf(filterObj.value) > -1
      }
      if (filterObj.type === 'status') {
        return data.status === filterObj.value
      }
    },
    /**
     * @description 选中产品                    
     */
    selectProduct ( data) {
      const { id } = data
      if (!id) return
      this.$emit('selectProduct', { id })
    },
    /**
     * @description input触发                    
     */
    inputTrigger (value) {
      this.$refs.tree.filter({
        type: 'text',
        value
      })
    },
    /**
     * @description select                    
     */
    selectTrigger (value) {
      this.$refs.tree.filter({
        type: 'status',
        value
      })
    },
    /**
     * @description 添加新的产品                
     */
    addProduct () {
      this.$emit('addProduct')
    }
  }
}
</script>

<style lang="less" scoped>
.product-list {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 100%;
  min-height: 600px;

  .panel-title {
    display: flex;
    justify-content: space-between;

    .panel-content {
      display: flex;
      align-items: center;

      .drag-product {
        margin-left: 12px;
      }
    }
  }

  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .el-input {
      width: 60%;
    }

    .el-select {
      width: 35%;
    }
  }

  .list-area {
    height: 900px;
    padding-top: 10px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #00b1b7;
    }

    & /deep/ .el-tree-node.is-current > .el-tree-node__content {
      color: @menuBg;
    }
  }
}
</style>
