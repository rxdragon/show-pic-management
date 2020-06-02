<template>
  <div class="iphone-model">
    <div class="iphone-view">
      <div class="test">这是标题大数据扩大时刻记得哈是的哈手机客户端看见啊啥的</div>
      <div class="test">这是标题</div>
      <div class="test">这是标题</div>
      <div class="test">这是标题</div>
      <div class="test">这是标题</div>
      <div class="test">这是标题</div>
      <div class="test">这是标题</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IphoneModel'
}
</script>

<style lang="less" scoped>
.iphone-model {
  width: 396px;
  height: 805px;
  background: url(~@assetsDir/images/iPhone-frame.png);

  .iphone-view {
    width: 354px;
    height: 100%;
    padding: 22px 0;
    margin: auto;
    background: #f7f7f7;
    -webkit-mask-image: url(~@assetsDir/images/iPhone-mask.png);
    mask-image: url(~@assetsDir/images/iPhone-mask.png);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: top;
    mask-position: top;
  }

  .test {
    color: red;
  }
}
</style>
