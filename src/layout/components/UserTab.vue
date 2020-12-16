<template>
  <div class="user-tab">
    <div v-if="$isDev" class="release-version">更新时间：{{ updateTime }}</div>
    <div class="user-avatar">
      <el-avatar :size="24" :src="avatarImg">
        <img
          alt="备份图"
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
        />
      </el-avatar>
      <div class="user-name">{{ nickname || name }}</div>
      <el-button class="icon-button" icon="iconfont iconexport" @click="logout" />
    </div>
  </div>
</template>

<script>
import * as User from '@/api/user.js'
import * as SessionTool from '@/utils/sessionTool.js'
import * as TimeUtil from '@/utils/timeUtil.js'
import { mapGetters } from 'vuex'
export default {
  name: 'UserTab',
  data () {
    const time = TimeUtil.formatTime(BUILD_TIME)
    return {
      updateTime: time
    }
  },
  computed: {
    ...mapGetters(['avatarImg', 'nickname', 'name'])
  },
  methods: {
    /**
     * @description 退出登录
     */
    logout () {
      SessionTool.removeSession()
      this.$router.push('/login')
      User.logout()
    }
  }
}
</script>

<style lang="less" scoped>
.user-tab {
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: @headerHeight;
  padding: 0 18px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);

  .release-version {
    margin-right: auto;
    color: deeppink;
  }

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
