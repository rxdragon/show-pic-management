<template>
  <div class="invoice-state-select">
    <el-select v-bind="$attrs" :popper-append-to-body="false" placeholder="请选择" clearable v-on="$listeners">
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
export default {
  name: 'InvoiceStateSelect',
  data () {
    return {
      options: [{
        label: '开具完成',
        value: 'plant'
      }, {
        label: '开具中',
        value: 'pull'
      }, {
        label: '已作废',
        value: 'fail'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.invoice-state-select {
  width: 164px;
}
</style>
