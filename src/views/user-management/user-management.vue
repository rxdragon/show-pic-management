<template>
  <div class="user-management module-panel">
    用户管理
    <el-button type="text" @click="goto">用户详情</el-button>
  </div>
</template>

<script>
export default {
  name: 'goto',
  methods: {
    goto () {
      this.$router.push('/user-management/user-detail')
    }
  }
}
</script>

<style lang="less" scoped>
.user-management {
  margin-top: 24px;
}
</style>
