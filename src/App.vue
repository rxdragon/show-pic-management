<template>
  <div id="App">
    <transition name="app-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import variables from '@assetsDir/styles/variables.less'

export default {
  name: 'App',
  created () {
    if (this.$isDev) {
      document.body.style.setProperty('--subMenuBg', variables.devSubMenuBg)
      document.body.style.setProperty('--menuBg', variables.devMenuBg)
    }
  }
}
</script>

<style lang="less">
@import "~@assetsDir/styles/variables.less";

html {
  background-color: #f0f2f5;
}

body {
  padding: 0;
  margin: 0;
  overflow: hidden;

  --menuBg: @menuBg;
  --subMenuBg: @subMenuBg;
  --boxShadow: '';
  --navbarMainLeft: 120px;
}

#App {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
