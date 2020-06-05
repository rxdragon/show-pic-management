<template>
  <div class="coupon-batch-state-select">
    <el-select
      v-bind="$attrs"
      :popper-append-to-body="false"
      clearable
      placeholder="请选择"
      v-on="$listeners"
    >
      <el-option v-for="(optionItem, optionIndex) in options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"/>
    </el-select>
  </div>
</template>

<script>
import { COUPON_BATCH_STATE, couponBatchToCN } from '@/model/Enumerate.js'

const seachState = [
  COUPON_BATCH_STATE.NORMAL,
  COUPON_BATCH_STATE.VOID
]
export default {
  name: 'CouponBatchStateSelect',
  data () {
    const stateOption = seachState.map(item => {
      return {
        label: couponBatchToCN[item],
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
.account-source-select {
  width: 164px;
}
</style>
