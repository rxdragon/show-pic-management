<template>
  <div class="product-select">
    <el-select
      v-bind="$attrs"
      clearable
      collapse-tags
      placeholder="默认全部"
      multiple
      v-on="$listeners"
      :popper-append-to-body="false"
      :disabled="disableState"
    >
      <el-option v-for="(optionItem, optionIndex) in options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"/>
    </el-select>
  </div>
</template>

<script>
import * as ProductApi from '@/api/product.js'

export default {
  name: 'ProductSelect',
  data () {
    return {
      options: [],
      disableState: false
    }
  },
  created () {
    this.getProductList()
  },
  methods: {
    /**
     * @description 获取组员
     */
    async getProductList () {
      const list = await ProductApi.getProductListNoClassify()
      const newList =list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
      this.options = newList
      this.disableState = false
    }
  }
}
</script>
