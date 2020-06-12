<template>
  <div class="coupon-list">
    <div class="header-plugin">
      <el-button type="primary" size="small" @click="linkToCreation">批量生成劵码</el-button>
      <coupon-code-search />
    </div>
    <main class="module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <span>创建时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="date-search search-item">
          <span>优惠劵名称</span>
          <el-input
            v-model.trim="couponName"
            @keyup.native.enter="searchData(1)"
            clearable
            placeholder="请输入"
            class="input-with-select"
          />
        </div>
        <div class="date-search search-item">
          <span>优惠劵状态</span>
          <coupon-batch-state-select v-model="couponState" />
        </div>
        <div class="button-box search-item">
          <el-button type="primary" size="small" @click="searchData(1)">查 询</el-button>
        </div>
      </div>
      <!-- 优惠劵列表 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="title" label="优惠劵名称" />
          <el-table-column prop="total" label="总发型数量" />
          <el-table-column prop="activeNum" label="绑定数量" />
          <el-table-column prop="useNum" label="使用数量" />
          <el-table-column prop="stateToCn" label="状态">
            <template slot-scope="{ row }">
              <div class="state-box">
                <div class="point" :class="stateColor(row.state)"></div>
                <span class="state-text" :class="stateTextColor(row.state)">{{ row.stateToCn }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="100"/>
          <el-table-column prop="createdStaff" label="创建人" />
          <el-table-column label="操作"  align="right" width="150">
            <template slot-scope="{ row }">
              <el-popover
                v-if="row.state !== COUPON_BATCH_STATE.VOID"
                placement="top"
                title="作废提示"
                width="220"
                v-model="row.showPopover"
                popper-class="cancellation-box"
              >
                <p>{{ `确定是否作废【${row.title}】下的所有优惠券？` }}</p>
                <p class="cancellation-tip">提示：已经使用的优惠券将无法作废</p>
                <div class="cancellation-button">
                  <el-button type="info" size="mini" @click="cancelPop(row)">取消</el-button>
                  <el-button type="danger" size="mini" @click="showCancellation(row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small">作废</el-button>
              </el-popover>
              <el-button class="detail-button" type="primary" size="small" @click="linkToDetail(row.id)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </main>
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
</template>

<script>
import DatePicker from '@/components/DatePicker'
import CouponBatchStateSelect from '@selectBox/CouponBatchStateSelect'
import CouponCodeSearch from './components/CouponCodeSearch'
import { getSeachTime } from '@/utils/timeUtil.js'
import { COUPON_BATCH_STATE } from '@/model/Enumerate'
import * as Coupon from '@/api/coupon.js'

export default {
  name: 'CouponList',
  components: { DatePicker, CouponBatchStateSelect, CouponCodeSearch },
  data () {
    return {
      COUPON_BATCH_STATE,
      timeSpan: null,
      couponName: '', // 优惠劵名称
      couponState: '', // 优惠劵状态
      tableData: [],
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  created () {
    this.searchData(1)
  },
  methods: {
    /**
     * @description 确认作废
     */
    async showCancellation (listItem) {
      try {
        this.$loading()
        const req = { id: listItem.id }
        await Coupon.voidCouponBatch(req)
        listItem.showPopover = false
        this.searchData()
      } catch (error) {
        this.$loadingClose()
        throw new Error(error)
      }
    },
    /**
     * @description 取消弹出框
     */
    cancelPop (listItem) {
      listItem.showPopover = false
    },
    /**
     * @description 获取优惠劵批次列表
     */
    async searchData (page) {
      try {
        this.$loading()
        this.pager.page = page ? page : this.pager.page
        const req = {
          cond: {},
          page: this.pager.page,
          pageSize: this.pager.pageSize
        }
        if (this.timeSpan) { req.cond.createdAtRange = getSeachTime(this.timeSpan) }
        if (this.couponName) { req.cond.title = this.couponName }
        if (this.couponState) { req.cond.state = this.couponState }
        if (!Object.keys(req.cond).length) delete req.cond
        const data = await Coupon.getCouponBatchList(req)
        this.tableData = data.list
        this.pager.total = data.total
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 处理页面变化
     */
    handleCurrentChange () {
      this.searchData()
    },
    /**
     * @description 跳转页面
     */
    linkToCreation () {
      this.$router.push('/marketing-center/coupon-management/creation-coupon')
    },
    /**
     * @description 跳转到详情
     */
    linkToDetail (id) {
      this.$router.push({
        path: '/marketing-center/coupon-management/coupon-detail',
        query: { id }
      })
    },
    stateColor (state) {
      if (state === this.COUPON_BATCH_STATE.NORMAL) return 'point--complete'
      if (state === this.COUPON_BATCH_STATE.VOID) return 'point--fail'
    },
    stateTextColor (state) {
      if (state === this.COUPON_BATCH_STATE.NORMAL) return 'state-text--complete'
      if (state === this.COUPON_BATCH_STATE.VOID) return 'state-text--fail'
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-list {
  margin-top: 20px;

  .table-box {
    .detail-button {
      margin-left: 10px;
    }
  }
}

.cancellation-box {
  .el-popover__title {
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
