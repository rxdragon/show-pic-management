<template>
  <div class="coupon-state-select">
    <el-select
      v-bind="$attrs"
      :popper-append-to-body="false"
      clearable
      placeholder="请选择"
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

export default {
  name: 'CouponStateSelect',
  data () {
    return {
      options: [
        {
          label: '完成',
          value: 'complete'
        },
        {
          label: '作废',
          value: 'fail'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.account-source-select {
  width: 164px;
}
</style>
