<template>
  <div class="order-source-select">
    <el-select v-bind="$attrs" :popper-append-to-body="false" clearable placeholder="请选择" v-on="$listeners">
      <el-option
        v-for="(optionItem, optionIndex) in options"
        :key="optionIndex"
        :label="optionItem.label"
        :value="optionItem.value"
      />
    </el-select>
  </div>
</template>

<script>
import { ORDER_FROM, OrderFromToCN } from '@/model/Enumerate.js'

const seachState = [
  ORDER_FROM.USER,
  ORDER_FROM.HIMO
]

export default {
  name: 'OrderSourceSelect',
  data () {
    const stateOption = seachState.map(item => {
      return {
        label: OrderFromToCN[item],
        value: item
      }
    })
    return {
      options: stateOption
    }
  }
}
</script>

<style lang="less" scoped>
.order-source-select {
  width: 164px;
}
</style>
