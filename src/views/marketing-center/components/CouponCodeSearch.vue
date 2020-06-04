<template>
  <div class="coupon-code-search">
    <el-popover width="300" trigger="click">
      <div v-loading="loading">
        <el-input placeholder="请输入10位劵码编号" maxlength="11" v-model.trim="couponMark">
          <el-button slot="append" icon="el-icon-search" @click="searchCouponCode"></el-button>
        </el-input>
        <div class="coupon-search-data" v-if="infoData.code">
          <p><span class="label">劵码编号：</span>{{ infoData.code }}</p>
          <p><span class="label">优惠劵名称：</span>{{ infoData.couponBatchTitle }}</p>
          <p><span class="label">状态：</span>{{ infoData.state }}</p>
          <p><span class="label">生成时间：</span>{{ infoData.creaetdAt }}</p>
          <p><span class="label">激活时间：</span>{{ infoData.activedAt }}</p>
          <p><span class="label">使用时间：</span>{{ infoData.usedAt }}</p>
          <p><span class="label">绑定账号：</span>{{ infoData.userId }}</p>
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
        state: '', // 劵码
        creaetdAt: '', // 劵码
        activedAt: '', // 劵码
        usedAt: '', // 劵码
        userId: '', // 劵码
        userOrderNum: '' // 劵码
      }
    }
  },
  methods: {
    /**
     * @description 查询优惠码
     */
    async searchCouponCode () {
      try {
        this.loading = true
        const req = {
          cond: {
            couponCode: this.couponMark
          },
          page: 1,
          pageSize: 1
        }
        const data = await Coupon.searchCouponCode(req)
        this.infoData = data
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
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
