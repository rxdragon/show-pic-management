<template>
  <div class="no-data">
    <img src="@assetsDir/images/no-data-img.png" alt="">
    <div class="desc">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'noData'
}
</script>

<style lang="less" scoped>
.no-data {
  padding: 24px;

  img {
    width: 200px;
    height: 130px;
  }
  
  .desc {
    font-size: 14px;
    font-weight: 400;
    color: #16161a;
    line-height: 20px;
  }
}
</style>
