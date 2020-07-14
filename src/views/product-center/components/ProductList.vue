<template>
  <div class="product-list">
    <div class="top">
      <span>产品列表</span>
      <el-button type="primary" size="small">添加产品</el-button>
    </div>
    <div class="search">
      <el-input v-model.trim="searchName" clearable placeholder="产品名称查询"></el-input>
      <el-select v-model="searchStat" placeholder="状态查询">
        <el-option :label="item.name" :value="item.status" v-for="(item, index) in productStat" :key="index"></el-option>
      </el-select>
    </div>
    <div class="list-area">
      <el-tree
        :expand-on-click-node = "false"
        default-expand-all
        :filter-node-method="filterProduct"
        :data="productList"
        @node-click="productSelect"
        ref="tree"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import * as Product from '@/api/product.js'

export default {
  name: 'ProductList',
  props: {},
  data() {
    return {
      productList: [],
      productStat: [
        {
          name: '已上线',
          status: 'online'
        },
        {
          name: '已下线',
          status: 'offline'
        },
        {
          name: '上线中',
          status: 'lining'
        }
      ],
      searchStat: '',
      searchName: '',
    }
  },
  watch: {
    searchName(val) {
      this.$refs.tree.filter({
        type: 'text',
        value: val
      })
    },
    searchStat(val) {
      this.$refs.tree.filter({
        type: 'status',
        value: val
      })
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
      if (!filterObj) return true
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
    productSelect ( data) {
      // console.log('data', data)
    }
  }
}
</script>

<style lang="less" scoped>
.product-list {
  box-sizing: border-box;
  width: 400px;
  min-height: 600px;
  padding: 10px;
  border: 1px solid lightgray;

  .top {
    display: flex;
    justify-content: space-between;
  }

  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .el-input {
      width: 50%;
    }

    .el-select {
      width: 30%;
    }
  }

  .list-area {
    padding-top: 10px;

    /deep/ .is-current {
      color: aquamarine;
    }
  }
}
</style>
