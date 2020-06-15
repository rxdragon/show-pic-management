<template>
  <div class="coupon-code-list">
    <div class="panel-title">
      券码编号 - {{ couponName }}
      <el-button class="right-flow" size="small" @click="outExcel" type="primary">导 出</el-button>
    </div>
    <div class="list-main">
      <div v-for="(couponItem, couponIndex) in couponList" :key="couponIndex" class="list-item">{{ couponItem.code }}</div>
    </div>
  </div>
</template>

<script>
import exportCouponExcel from '../exportCouponExcel'

export default {
  name: 'CouponCodeList',
  props: {
    couponList: { type: Array, required: true },
    couponName: { type: String, required: true }
  },
  methods: {
    /**
     * @description 导出表格
     */
    outExcel () {
      try {
        this.$loading()
        exportCouponExcel(this.couponName, this.couponList)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-code-list {
  width: 335px;
  background-color: #fff;

  .list-main {
    display: flex;
    flex-wrap: wrap;
    max-height: 160px;
    margin-top: 16px;
    overflow-y: auto;

    .list-item {
      width: 33%;
      font-size: 12px;
      line-height: 24px;
      color: #909399;

      &:nth-of-type(3n) {
        text-align: right;
      }

      &:nth-of-type(3n -1) {
        text-align: center;
      }
    }
  }
}
</style>
