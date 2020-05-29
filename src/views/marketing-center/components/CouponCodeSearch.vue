<template>
  <div class="coupon-code-search">
    <el-popover width="300" trigger="click">
      <div>
        <el-input
          placeholder="请输入10位劵码编号"
          maxlength="11"
          v-model.trim="couponMark"
          @click="searchCouponMark"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="search-data">
          <p>劵码编号：12HJ89SU09</p>
          <p>优惠劵名称：asda</p>
          <p>状态：已使用</p>
          <p>生成时间：2019-09-08 13:00:00</p>
          <p>激活时间：2019-09-08 13:00:00</p>
          <p>使用时间：2019-09-08 13:00:00</p>
          <p>绑定账号：12287655120</p>
          <p>使用订单号：X202005211234</p>
        </div>
      </div>
      <el-button slot="reference" type="primary" size="small">劵码查询工具</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'CouponCodeSearch',
  data () {
    return {
      couponMark: ''
    }
  },
  methods: {
    /**
     * @description 查询优惠码
     */
    searchCouponMark () {
      // TODO
    }
  }
}
</script>
