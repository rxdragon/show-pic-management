<template>
  <div class="finance-index module-panel">
    发票管理
    <el-button type="text" @click="goto">开票</el-button>
  </div>
</template>

<script>
export default {
  name: 'finance-index',
  methods: {
    goto () {
      this.$router.push('/finance-center/invoice-issue')
    }
  }
}
</script>

<style lang="less" scoped>
.finance-index {
  margin-top: 24px;
}
</style>
