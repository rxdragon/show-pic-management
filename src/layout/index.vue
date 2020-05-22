<template>
  <el-container>
    <!-- 内容 -->
    <el-container class="container-main">
      <!-- 菜单 -->
      <el-aside :class="{hideSidebar: false}" class="app-wrapper">
        <sidebar class="sidebar-container" />
      </el-aside>
      <!-- 内容 -->
      <el-main class="main-box">
        <user-tab />
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { AppMain, Sidebar, UserTab } from './components'
export default {
  name: 'Layout',
  components: { AppMain, Sidebar, UserTab }
}
</script>

<style lang="less">
.el-aside {
  position: relative;
  width: @sideBarWidth !important;
  padding: 0 !important;
  margin-bottom: 0;
  line-height: inherit;
  background-color: #d3dce6;
}

.el-main {
  width: calc(~'100vw - @{sideBarWidth}');
  height: 100vh;
  padding: 0 !important;
  background-color: #f0f2f5;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #cdcdcd;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-button {
    display: none;
    background: #fff;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }
}

.el-container .main-box {
  overflow: inherit;

  .web-state {
    position: fixed;
    top: 42px;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(~'100% - @{sideBarWidth}');
    height: 36px;
    line-height: 36px;
    color: #fb602d;
    text-align: center;
    background-color: #fdeae4;

    .refush-button {
      padding: 2px;
      margin-left: 10px;
      color: #fb602d;
      background-color: #fdeae4;
      border-color: #fb602d;

      &:hover {
        box-shadow: 4px 4px 2px 0 #d4d4d4;
      }
    }
  }
}

.container-main {
  background-color: #131923;
}

.tap-view {
  height: 34px;
  background-color: red;
}
</style>
