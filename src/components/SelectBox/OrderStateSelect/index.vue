<template>
  <div class="order-state-select">
    <el-select v-bind="$attrs" :popper-append-to-body="false" clearable multiple collapse-tags placeholder="请选择" v-on="$listeners">
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
import { ORDER_STATE, STREAM_STATE, SECOND_RETOUCH_STATE, orderStateToCN, streamToCN, secondRetouchStateToCN } from '@/model/Enumerate.js'
const filterToCN = {
  ...orderStateToCN,
  ...streamToCN,
  ...secondRetouchStateToCN
}
export default {
  name: 'OrderStateSelect',
  data () {
    const seachState = [
      ORDER_STATE.WAIT_PAIED,
      STREAM_STATE.RETOUCHING,
      STREAM_STATE.COMPLETE,
      ORDER_STATE.CANCELLED,
      STREAM_STATE.WAIT_RETOUCH,
      SECOND_RETOUCH_STATE.ADJUSTING,
      ORDER_STATE.COMPLETE
    ]
    const stateOption = seachState.map(item => {
      return {
        label: filterToCN[item],
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
.order-state-select {
  min-width: 164px;
}
</style>
