<template>
  <el-select
    v-bind="$attrs"
    v-model="searchStat"
    :popper-append-to-body="false"
    clearable
    placeholder="状态查询"
    v-on="$listeners"
  >
    <el-option :label="item.name" :value="item.status" v-for="(item, index) in productStat" :key="index"></el-option>
  </el-select>
</template>

<script>
import { ProductStatusToCN, PRODUCT_STATE } from '@/model/Enumerate.js'

const productStat = []
for (const key in PRODUCT_STATE) {
  const tempObj = {}
  tempObj.status = PRODUCT_STATE[key]
  tempObj.name = ProductStatusToCN[PRODUCT_STATE[key]]
  productStat.push(tempObj)
}

export default {
  name: 'ProductStatusSelect',
  data () {
    return {
      searchStat: '',
      productStat
    }
  }
}
</script>
