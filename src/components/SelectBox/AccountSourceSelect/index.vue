<template>
  <div class="account-source-select">
    <el-select v-bind="$attrs" :popper-append-to-body="false" placeholder="请选择" v-on="$listeners">
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
  name: 'AccountSourceSelect',
  data () {
    return {
      options: [{
        label: '全部',
        value: 0
      }, {
        label: '海马体',
        value: 'plant'
      }, {
        label: '拔草',
        value: 'pull'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.account-source-select {
  width: 164px;
}
</style>
