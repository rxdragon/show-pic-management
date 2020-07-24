<template>
  <div class="drag-product" >
    <el-button
      type="primary"
      icon="el-icon-sort"
      @click="showDialog"
      size="mini"
      circle
    />
    <el-dialog title="产品顺序" append-to-body :visible.sync="dialogVisible" custom-class="product-drag">
      <draggable
        v-loading="loading"
        class="list-group"
        tag="ul"
        v-model="productList"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <li class="list-group-item" v-for="(productItem, productIndex) in productList" :key="productItem.id">
            <span>{{ productItem.name }}</span>
            <span>顺序{{ productIndex + 1 }}</span>
          </li>
        </transition-group>
      </draggable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import * as ProductApi from '@/api/product.js'

const dragOptions = {
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost"
}

export default {
  name: 'DragProduct',
  components: { draggable },
  data () {
    return {
      dragOptions,
      dialogVisible: false,
      productList: [], // 
      drag: false, // 是否拖拽
      loading: false // 加载
    }
  },
  methods: {
    /**
     * @description 展示数据
     */
    showDialog () {
      this.getProductList()
      this.dialogVisible = true
    },
    /**
     * @description 获取产品列表
     */
    async getProductList () {
      try {
        this.loading = true
        this.productList = await ProductApi.getProductListForSort()
      } finally {
        this.loading = false
      }
    },
    /**
     * @description 提交分数
     */
    async submitData () {
      try {
        const productWeights = this.productList.map((productItem, productIndex) => {
          return {
            id: productItem.id,
            weight: this.productList.length - productIndex
          }
        })
        const req = { productWeights }
        this.loading = true
        await ProductApi.sortProduct(req)
        this.dialogVisible = false
        this.$newMessage.success('修改排序成功')
        this.$emit('uploadSuccess')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}

.list-group {
  min-height: 20px;
  padding-left: 0;
}

.list-group-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 10px 18px;
  cursor: move;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);

  & + .list-group-item {
    border-top-width: 0;
  }
}
</style>

<style lang="less">
.product-drag {
  .el-dialog__body {
    max-height: 500px;
    padding-top: 0;
    padding-bottom: 0;
    overflow-y: scroll;
  }
}
</style>
