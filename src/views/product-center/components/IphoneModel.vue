<template>
  <div id="phoneModel" class="iphone-model">
    <div class="iphone-view">
      <div class="phone-header"></div>
      <div class="html-page" v-html="pageHtml">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IphoneModel',
  props: {
    pageHtml: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activityDesc: []
    }
  }
}
</script>

<style lang="less" scoped>
.iphone-model {
  --bkgColor: #f0f2f5;

  width: 422px;
  height: 858px;
  background: url(~@assetsDir/images/iPhone-frame.png);

  .iphone-view {
    width: 375px;
    height: 100%;
    padding: 22px 0;
    margin: 0 24.5px 0 22.5px;
    background: #f7f7f7;
    -webkit-mask-image: url(~@assetsDir/images/iPhone-mask.png);
    mask-image: url(~@assetsDir/images/iPhone-mask.png);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: top;
    mask-position: top;
  }

  .phone-header {
    height: 83px;
    background: url(~@assetsDir/images/miniapp-header.png) no-repeat;
    background-size: contain;
  }

  .html-page {
    height: calc(100% - 83px);
    overflow-y: overlay;
    background: var(--bkgColor);
  }
}
</style>
