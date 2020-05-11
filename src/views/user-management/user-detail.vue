<template>
  <div class="user-detail module-panel">
    <user-info></user-info>
  </div>
</template>

<script>
import UserInfo from './components/UserInfo'

export default {
  name: 'user-detail',
  components: { UserInfo },
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.user-detail {
  margin-top: 24px;
}
</style>
