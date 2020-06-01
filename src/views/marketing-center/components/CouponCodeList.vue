<template>
  <div class="coupon-code-list">
    <div class="panel-title">
      券码编号
      <el-button class="right-flow" size="small" type="primary">导 出</el-button>
    </div>
    <div class="list-main">
      <div v-for="(item, index) in 4" :key="index" class="list-item">X123{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CouponCodeList'
}
</script>

<style lang="less" scoped>
.coupon-code-list {
  width: 400px;

  .list-main {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;

    .list-item {
      width: 33%;
      font-size: 12px;
      line-height: 24px;
      color: #909399;

      &:nth-of-type(3n) {
        text-align: right;
      }
    }
  }
}
</style>
