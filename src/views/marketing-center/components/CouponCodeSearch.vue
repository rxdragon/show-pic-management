<template>
  <div class="coupon-code-search">
    <el-popover width="300" trigger="click">
      <div v-loading="loading">
        <el-input
          placeholder="请输入10位劵码编号"
          clearable
          maxlength="10"
          v-model.trim="couponMark"
          @keyup.enter.native="searchCouponCode"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchCouponCode"></el-button>
        </el-input>
        <div class="coupon-search-data" v-if="infoData.code">
          <p><span class="label">劵码编号：</span>{{ infoData.code }}</p>
          <p><span class="label">优惠劵名称：</span>{{ infoData.couponBatchTitle }}</p>
          <p><span class="label">状态：</span>{{ infoData.stateCN }}</p>
          <p><span class="label">适用产品：</span>{{ infoData.productLimitStr || '全部产品' }}</p>
          <p><span class="label">生成时间：</span>{{ infoData.creaetdAt }}</p>
          <p><span class="label">绑定时间：</span>{{ infoData.bindAt }}</p>
          <p><span class="label">使用时间：</span>{{ infoData.usedAt }}</p>
          <p><span class="label">绑定账号：</span>{{ infoData.userTel }}</p>
          <p><span class="label">使用订单号：</span>{{ infoData.userOrderNum }}</p>
        </div>
        <no-data v-else />
      </div>
      <el-button slot="reference" type="primary" size="small">劵码查询工具</el-button>
    </el-popover>
  </div>
</template>

<script>
import * as Coupon from '@/api/coupon.js'
import NoData from '@/components/NoData'

export default {
  name: 'CouponCodeSearch',
  components: { NoData },
  data () {
    return {
      couponMark: '',
      loading: false,
      infoData: {
        code: '', // 劵码
        couponBatchTitle: '', // 优惠劵名称
        stateCN: '', // 中文状态字段
        creaetdAt: '', // 创建时间
        bindAt: '', // 绑定时间
        usedAt: '', // 使用时间
        userTel: '', // 用户绑定手机号
        userOrderNum: '' // 使用订单号
      }
    }
  },
  methods: {
    /**
     * @description 查询优惠码
     */
    async searchCouponCode () {
      try {
        if (!this.couponMark) return this.$newMessage.warning('请输入券码编号')
        if (this.couponMark.length !== 10) return this.$newMessage.warning('请输入10位券码编号')
        this.loading = true
        const req = {
          code: this.couponMark
        }
        this.infoData = await Coupon.searchCouponCode(req)
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 400)
      }
    }
  }
}
</script>

<style lang="less">
.coupon-search-data {
  margin-top: 12px;

  p {
    display: flex;
    margin: 8px 0;

    .label {
      display: inline-block;
      flex-shrink: 0;
      width: 100px;
      text-align: right;
    }
  }
}
</style>
