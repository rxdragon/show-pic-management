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
        <div class="coupon-search-data">
          <p>
            <span class="label">劵码编号：</span>
            {{ couponCode }}
          </p>
          <p>
            <span class="label">优惠劵名称：</span>
            {{ couponName }}
          </p>
          <p>
            <span class="label">状态：</span>
            {{ couponState }}
          </p>
          <p>
            <span class="label">生成时间：</span>
            {{ createTime }}
          </p>
          <p>
            <span class="label">激活时间：</span>
            {{ activeTime }}
          </p>
          <p>
            <span class="label">使用时间：</span>
            {{ usedTime }}
          </p>
          <p>
            <span class="label">绑定账号：</span>
            {{ couponUser }}
          </p>
          <p>
            <span class="label">使用订单号：</span>
            {{ activeOrder }}
          </p>
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
      couponMark: '',
      couponCode: '12HJ89SU09', // 劵码
      couponName: 'xxx活动优惠', // 优惠劵名称
      couponState: '已使用', // 劵码
      createTime: '2019-09-08 13:00:00', // 劵码
      activeTime: '2019-09-08 13:00:00', // 劵码
      usedTime: '2019-09-08 13:00:00', // 劵码
      couponUser: '18268882513', // 劵码
      activeOrder: 'X202005211234' // 劵码
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

<style lang="less">
.coupon-search-data {
  margin-top: 12px;

  p {
    margin: 8px 0;

    .label {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
}
</style>
