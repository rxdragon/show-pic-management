<template>
  <div class="home">
    <div class="logo-tip">
      <div class="logo-img showpic-logo" />
      <div class="logo-desc">
        <span class="black">欢迎来到</span>
        <span class="desc">修修兽管理后台</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@assetsDir/styles/variables.less";

.home {
  position: relative;
  height: 100%;

  .logo-tip {
    position: absolute;
    top: 40%;
    left: 50%;
    width: min-content;
    transform: translateX(-50%) translateY(-50%);

    .logo-img {
      width: 200px;
      height: 68.7px;
      margin: auto;
    }

    .logo-desc {
      width: 500px;
      margin-top: 26px;
      font-family: @pingFang;
      font-size: 30px;
      font-weight: 600;
      line-height: 38px;
      color: #131923;
      text-align: center;

      .desc {
        color: @green;
      }
    }
  }
}
</style>

