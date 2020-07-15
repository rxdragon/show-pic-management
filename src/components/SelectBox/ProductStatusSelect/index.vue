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
import { ProductStatusNameEnum, PRODUCT_STATE } from '@/model/Enumerate.js'

const productStat = PRODUCT_STATE.map((item) => {
  return {
    status: item,
    name: ProductStatusNameEnum[item],
  }
})

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
