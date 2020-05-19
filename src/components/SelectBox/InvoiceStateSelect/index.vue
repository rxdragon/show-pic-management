<template>
  <div class="invoice-state-select">
    <el-select
      v-bind="$attrs"
      :popper-append-to-body="false"
      placeholder="请选择"
      clearable
      v-on="$listeners"
    >
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
import { INVOICE_STATE, invalidToCN } from '@/model/Enumerate.js'

export default {
  name: 'InvoiceStateSelect',
  data () {
    const searchEunm = [
      INVOICE_STATE.PENDING,
      INVOICE_STATE.COMPLETE,
      INVOICE_STATE.FAIL,
      INVOICE_STATE.INVALID
    ]
    const optionSearch = searchEunm.map(item => {
      return {
        label: invalidToCN[item],
        value: item
      }
    })
    return {
      options: optionSearch
    }
  }
}
</script>

<style lang="less" scoped>
.invoice-state-select {
  width: 164px;
}
</style>
