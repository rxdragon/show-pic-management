<template>
  <div class="coupon-state-select">
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
import { COUPON_STATE, couponToCN } from '@/model/Enumerate.js'

const seachState = [
  COUPON_STATE.ACTIVATED,
  COUPON_STATE.UNUSED,
  COUPON_STATE.USED,
  COUPON_STATE.ABOLISHED,
  COUPON_STATE.EXPIRED
]
export default {
  name: 'CouponStateSelect',
  data () {
    const stateOption = seachState.map(item => {
      return {
        label: couponToCN[item],
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
