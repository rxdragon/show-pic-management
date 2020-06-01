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
            placeholder="请输入"
            class="input-with-select"
          ></el-input>
        </div>
        <div class="date-search search-item">
          <span>优惠劵状态</span>
          <coupon-state-select v-model="couponState" />
        </div>
        <div class="button-box search-item">
          <el-button type="primary" size="small" @click="searchData(1)">查 询</el-button>
        </div>
      </div>
      <!-- 优惠劵列表 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="couponName" label="优惠劵名称" />
          <el-table-column prop="couponAllCount" label="总发型数量" />
          <el-table-column prop="activeCount" label="激活数量" />
          <el-table-column prop="usedCount" label="使用数量" />
          <el-table-column prop="couponState" label="状态" />
          <el-table-column prop="createTime" label="创建时间" width="100"/>
          <el-table-column prop="createPeople" label="创建人" />
          <el-table-column label="操作"  align="right" width="150">
            <template slot-scope="{ row }">
              <el-popover
                placement="top"
                title="作废提示"
                width="220"
                v-model="row.showPopover"
                popper-class="cancellation-box"
              >
                <p>{{ `确定是否作废【${row.couponName}】下的所有优惠券？` }}</p>
                <p class="cancellation-tip">提示：已经使用的优惠券将无法作废</p>
                <div class="cancellation-button">
                  <el-button type="info" size="mini" @click="cancelPop(row)">取消</el-button>
                  <el-button type="danger" size="mini" @click="showCancellation(row)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small">作废</el-button>
              </el-popover>
              <el-button
                class="detail-button"
                type="primary"
                size="small"
                @click="linkToDetail(row)"
              >
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
import CouponStateSelect from '@selectBox/CouponStateSelect'
import CouponCodeSearch from './components/CouponCodeSearch'

export default {
  name: 'CouponList',
  components: { DatePicker, CouponStateSelect, CouponCodeSearch },
  data () {
    return {
      timeSpan: null,
      couponName: '', // 优惠劵名称
      couponState: '', // 优惠劵状态
      tableData: [{
        couponName: '优惠劵名称',
        couponAllCount: '10',
        activeCount: '10',
        usedCount: 8,
        couponState: '完成',
        createTime: '2019-09-09 13:00:00',
        createPeople: '张三',
        showPopover: false
      }],
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  methods: {
    /**
     * @description 确认作废
     */
    showCancellation (listItem) {
      // TODO 确认作废
      listItem.showPopover = false
      this.searchData()
    },
    /**
     * @description 取消弹出框
     */
    cancelPop (listItem) {
      listItem.showPopover = false
    },
    /**
     * @description 搜索
     */
    searchData (page) {
      this.pager.page = page ? page : this.pager.page
      this.$loading()
      this.$loadingClose()
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
    linkToDetail () {
      this.$router.push('/marketing-center/coupon-management/coupon-detail')
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
