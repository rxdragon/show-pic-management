<template>
  <div class="user-tab">
    <div class="user-avatar">
      <el-avatar :size="24" :src="avatarImg">
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
      </el-avatar>
      <div class="user-name">{{ nickname || name }}</div>
      <el-button class="icon-button" icon="iconfont iconexport" @click="logout" />
    </div>
  </div>
</template>

<script>
import * as User from '@/api/user.js'
import { mapGetters } from 'vuex'
export default {
  name: 'UserTab',
  computed: {
    ...mapGetters(['avatarImg', 'nickname', 'name'])
  },
  methods: {
    /**
     * @description 退出登录
     */
    async logout () {
      await User.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assetsDir/styles/variables.less';

.user-tab {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: @headerHeight;
  padding: 0 18px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);

  .user-avatar {
    display: flex;
    align-items: center;

    .user-name {
      margin: 0 5px 0 11px;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      color: var(--textColor);
    }
  }

  .icon-button {
    width: 24px;
    padding: 0;
    border: none;

    &:focus,
    &:hover {
      color: #4669fb;
      background-color: #fff;
      border: none;
    }
  }
}
</style>
