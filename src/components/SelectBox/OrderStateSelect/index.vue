<template>
  <div class="order-state-select">
    <el-select
      v-bind="$attrs"
      :popper-append-to-body="false"
      clearable
      collapse-tags
      placeholder="请选择"
      v-on="$listeners"
    >
      <el-option v-for="(optionItem, optionIndex) in options" :key="optionIndex" :label="optionItem.label" :value="optionItem.value"/>
    </el-select>
  </div>
</template>

<script>
import {
  ORDER_STATE,
  STREAM_STATE,
  SECOND_RETOUCH_STATE,
  orderStateToCN,
  streamToCN,
  secondRetouchStateToCN
} from '@/model/Enumerate.js'
export default {
  name: 'OrderStateSelect',
  data () {
    const ORDER_KEY = 'state,'
    const STREAM_KEY = 'orderItemState,'
    const SECOND_RETOUCH_KEY = 'orderItemSecondRetouchState,'
    return {
      options: [
        {
          label: orderStateToCN[ORDER_STATE.WAIT_PAIED],
          value: ORDER_KEY + ORDER_STATE.WAIT_PAIED
        },
        {
          label: streamToCN[STREAM_STATE.RETOUCHING],
          value: STREAM_KEY + STREAM_STATE.RETOUCHING
        },
        {
          label: streamToCN[STREAM_STATE.COMPLETE],
          value: STREAM_KEY + STREAM_STATE.COMPLETE
        },
        {
          label: orderStateToCN[ORDER_STATE.CANCELLED],
          value: ORDER_KEY + ORDER_STATE.CANCELLED
        },
        {
          label: streamToCN[STREAM_STATE.WAIT_RETOUCH],
          value: STREAM_KEY + STREAM_STATE.WAIT_RETOUCH
        },
        {
          label: secondRetouchStateToCN[SECOND_RETOUCH_STATE.ADJUSTING],
          value: SECOND_RETOUCH_KEY + SECOND_RETOUCH_STATE.ADJUSTING
        },
        {
          label: orderStateToCN[ORDER_STATE.COMPLETE],
          value: ORDER_KEY + ORDER_STATE.COMPLETE
        },
        {
          label: orderStateToCN[ORDER_STATE.CLOSED],
          value: ORDER_KEY + ORDER_STATE.CLOSED
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.order-state-select {
  min-width: 164px;
}
</style>
