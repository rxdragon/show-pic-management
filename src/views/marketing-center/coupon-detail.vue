<template>
  <div class="coupon-detail">
    <div class="module-panel">
      <div class="coupon-base">
        <div class="panel-title">券码基础信息</div>
        <el-row class="info-main" :gutter="20" type="flex">
          <el-col :span="6">
            <div class="label">优惠劵名称：</div>
            <div class="value">{{ couponBatchInfo.title }}</div>
          </el-col>
          <el-col :span="6">
            <div class="label">对应活动：</div>
            <div class="value">
              <el-tooltip class="item" effect="dark" :content="couponBatchInfo.activityName" placement="top-start">
                <div class="activity-name">{{ couponBatchInfo.activityName }}</div>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="label">优惠劵类型：</div>
            <div class="value">{{ couponBatchInfo.couponTypeCN }}</div>
          </el-col>
          <el-col :span="6">
            <div class="label">{{ couponBatchInfo.couponType === 'decrease_coupon' ? '面额：' : '折扣力度：' }}</div>
            <div
              class="value"
              v-if="couponBatchInfo.couponType === 'decrease_coupon'"
            >
              {{ couponBatchInfo.discount | stringMoney }}
            </div>
            <div class="value" v-else>{{ couponBatchInfo.discount }}折</div>
          </el-col>
          <el-col
            :span="6"
            v-if="couponBatchInfo.couponType !== 'decrease_coupon'"
          >
            <div class="label">减免上限：</div>
            <div class="value">{{ couponBatchInfo.reductionUpperLimit | stringMoney }}</div>
          </el-col>
          <el-col :span="6">
            <div class="label">使用门槛：</div>
            <div class="value" v-if="couponBatchInfo.orderMoneyLowerLimit">满{{ couponBatchInfo.orderMoneyLowerLimit | stringMoney }}可用</div>
            <div class="value" v-else>无限制</div>
          </el-col>
          <el-col :span="6">
            <div class="label">总发行量：</div>
            <div class="value">{{ couponBatchInfo.total || 0 }}张</div>
          </el-col>
          <el-col :span="6">
            <div class="label">有效时间：</div>
            <div class="value">
              <el-tooltip class="item" effect="dark" :content="couponBatchInfo.effectivityTime" placement="top-start">
                <div class="effectivity-time">{{ couponBatchInfo.effectivityTime }}</div>
              </el-tooltip>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="label">适用产品：</div>
            <div class="value">{{ couponBatchInfo.productLimitStr || '全部产品' }}</div>
          </el-col>
        </el-row>
        <div class="remark">
          <div class="label">备注：</div>
          <div class="value">{{ couponBatchInfo.note }}</div>
        </div>
        <el-row class="info-main active-info" :gutter="20" type="flex">
          <el-col :span="4">
            <div class="label">待绑定：</div>
            <div class="value">{{ couponBatchInfo.waitActiveNum || 0 }}张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已绑定：</div>
            <div class="value">{{ couponBatchInfo.activeNum || 0 }}张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已使用：</div>
            <div class="value">{{ couponBatchInfo.useNum || 0 }}张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已过期：</div>
            <div class="value">{{ couponBatchInfo.expireNum || 0 }}张</div>
          </el-col>
          <el-col :span="4">
            <div class="label">已作废：</div>
            <div class="value">{{ couponBatchInfo.voidNum || 0 }}张</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="coupon-tabel-search module-panel">
      <div class="panel-title">券码编号信息</div>
      <div class="search-box">
        <div class="search-item">
          <span>券码编号：</span>
          <el-input v-model="couponCode" clearable placeholder="请输入编号"></el-input>
        </div>
        <div class="search-item">
          <span>券码状态：</span>
          <coupon-state-select multiple collapse-tags v-model="couponStates" />
        </div>
        <div class="search-button search-item">
          <el-button size="small" type="primary" @click="searchCouponList">查 询</el-button>
          <el-button size="small" type="blue" @click="outExcel">导 出</el-button>
        </div>
      </div>
      <!-- 优惠券列表 -->
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="code" label="券码编号" width="120" />
        <el-table-column prop="stateCN" label="状态">
          <template slot-scope="{ row }">
            <div class="state-box">
              <div class="point" :class="stateColor(row.state)"></div>
              <span class="state-text" :class="stateTextColor(row.state)">{{ row.stateCN }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bindAt" label="绑定时间" min-width="80" />
        <el-table-column prop="usedAt" label="使用时间" min-width="80" />
        <el-table-column prop="userTel" label="绑定账号" min-width="100" />
        <el-table-column prop="userOrderNum" label="使用订单号" min-width="130"/>
        <el-table-column label="操作" align="right">
          <template slot-scope="{ row }">
            <el-popover
              v-if="row.state === COUPON_STATE.UNUSED || row.state === COUPON_STATE.ACTIVATED"
              placement="top"
              title="作废提示"
              width="220"
              v-model="row.showPopover"
              popper-class="cancellation-box"
            >
              <p>{{ `确定是否作废【${row.code}】券码？` }}</p>
              <p class="cancellation-tip">提示：已经使用的优惠券将无法作废</p>
              <div class="cancellation-button">
                <el-button type="info" size="mini" @click="cancelPop(row)">取消</el-button>
                <el-button type="danger" size="mini" @click="showCancellation(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="small">作废</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          hide-on-single-page
          layout="prev, pager, next, jumper"
          :current-page.sync="pager.page"
          :page-size="pager.pageSize"
          :total="pager.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CouponStateSelect from '@selectBox/CouponStateSelect'
import exportCouponExcel from './exportCouponExcel'
import { COUPON_STATE } from '@/model/Enumerate.js'
import * as Coupon from '@/api/coupon.js'

export default {
  name: 'CouponDetail',
  components: { CouponStateSelect },
  data () {
    return {
      COUPON_STATE,
      couponBatchId: '',
      couponCode: '',
      couponStates: [],
      couponBatchInfo: {},
      tableData: [],
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  async activated () {
    this.couponBatchId = this.$route.query.id
    this.$loading()
    await Promise.all([
      this.getCouponBatchDetail(),
      this.getCouponBatchCodeUseList(1)
    ])
    this.$loadingClose()
  },
  methods: {
    /**
     * @description 搜索券码列表
     */
    async searchCouponList () {
      try {
        this.$loading()
        await this.getCouponBatchCodeUseList(1)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 获取优惠券批次详情
     */
    async getCouponBatchDetail () {
      const req = { id: this.couponBatchId }
      this.couponBatchInfo = await Coupon.getCouponBatchDetail(req)
    },
    /**
     * @description 获取批次下列表
     */
    async getCouponBatchCodeUseList (page) {
      this.pager.page = page ? page : this.pager.page
      const req = {
        cond: {
          couponBatchId: this.couponBatchId
        },
        page: this.pager.page,
        pageSize: this.pager.pageSize
      }
      if (this.couponCode) { req.cond.couponCode = this.couponCode }
      if (this.couponStates.length) { req.cond.couponStates = this.couponStates }
      const data = await Coupon.getCouponBatchCodeUseList(req)
      this.tableData = data.list
      this.pager.total = data.total
    },
    /**
     * @description 取消作废选择
     */
    cancelPop (listItem) {
      listItem.showPopover = false
    },
    /**
     * @description 确定作废
     */
    async showCancellation (listItem) {
      try {
        this.$loading()
        const req = {
          code: listItem.code,
          batchId: listItem.base.create_log_id
        }
        await Coupon.voidCouponCode(req)
        listItem.showPopover = false
        this.searchCouponList()
      } catch (error) {
        this.$loadingClose()
        throw new this.$ApiError(error)
      }
    },
    /**
     * @description 监听页面变化
     */
    handleCurrentChange () {
      try {
        this.$loading()
        this.getCouponBatchCodeUseList()
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 导出表格
     */
    async outExcel () {
      try {
        this.$loading()
        const req = {
          cond: {
            couponBatchId: this.couponBatchId
          },
          page: 1,
          pageSize: 5000
        }
        if (this.couponCode) { req.cond.couponCode = this.couponCode }
        if (this.couponStates.length) { req.cond.couponStates = this.couponStates }
        const data = await Coupon.getCouponBatchCodeUseList(req)
        exportCouponExcel(this.couponBatchInfo.title, data.list)
      } finally {
        this.$loadingClose()
      }
    },
    stateColor (state) {
      if (state === this.COUPON_STATE.ACTIVATED) return 'point--pending'
      if (state === this.COUPON_STATE.UNUSED) return 'point--complete'
      if (state === this.COUPON_STATE.EXPIRED) return 'point--fail'
    },
    stateTextColor (state) {
      if (state === this.COUPON_STATE.ACTIVATED) return 'state-text--pending'
      if (state === this.COUPON_STATE.UNUSED) return 'state-text--complete'
      if (state === this.COUPON_STATE.EXPIRED) return 'state-text--fail'
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-detail {
  margin-top: 24px;

  .effectivity-time {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: pre-line;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .activity-name {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: pre-line;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .label {
    flex-shrink: 0;
    width: 100px;
    font-size: 14px;
    font-weight: 400;
    color: #3e3e3e;
  }

  .value {
    font-size: 14px;
    font-weight: 400;
    color: #6e6e6e;
  }

  .coupon-base {
    .info-main {
      flex-wrap: wrap;
      margin-top: 20px;

      .el-col {
        display: flex;
        margin-bottom: 16px;
      }
    }

    .active-info {
      .el-col {
        margin-bottom: 0;

        .label {
          width: 80px;
        }
      }
    }

    .remark {
      display: flex;

      .value {
        width: 600px;
        word-wrap: break-word;
      }
    }
  }

  .coupon-tabel-search {
    margin-top: 20px;

    .search-box {
      margin-top: 20px;
    }
  }
}
</style>

<style lang="less">
.cancellation-box {
  & /deep/ .el-popover__title {
    font-weight: 500;
  }

  .cancellation-tip {
    margin-top: 4px;
    font-size: 12px;
    color: @color-text-placeholder;
  }

  .cancellation-button {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
