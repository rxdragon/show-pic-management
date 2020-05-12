<template>
  <div class="finance-index module-panel">
    <div class="header-plugin">
      <el-button type="primary" size="small" @click="issueInvoice">开具发票</el-button>
    </div>
    <main class="module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <span>申请时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="date-search search-item">
          <span>发票抬头</span>
          <el-input v-model.trim="orderSearchValue" placeholder="请输入" class="input-with-select"></el-input>
        </div>
        <div class="date-search search-item">
          <span>开票状态</span>
          <invoice-state-select v-model="orderState" />
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData">查 询</el-button>
          <el-button type="success" size="small">导 出</el-button>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="orderState" label="开票时间" />
          <el-table-column prop="orderState" label="申请人账号" />
          <el-table-column prop="orderState" label="抬头类型" />
          <el-table-column prop="orderState" label="发票抬头" />
          <el-table-column prop="orderState" label="发票金额" />
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <div class="state-box">
                <div class="point point--success"></div>
                <span class="state-text">{{ row.orderNum }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="showDetail(row.id)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <no-data v-show="!tableData.length">当前暂无订单</no-data>
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
    <el-drawer
      title="发票详情"
      custom-class="invoice-class"
      :visible.sync="drawer">
      <invoice-info />
    </el-drawer>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import NoData from '@/components/NoData'
import InvoiceStateSelect from '@selectBox/InvoiceStateSelect'
import InvoiceInfo from './components/InvoiceInfo'

export default {
  name: 'finance-index',
  components: { DatePicker, InvoiceStateSelect, NoData, InvoiceInfo },
  data () {
    return {
      timeSpan: null,
      orderState: '',
      orderSource: '',
      orderSeachType: 1, // 查询类型 1 云端流水号 2 订单号 3 顾客姓名 4 手机号
      orderSearchValue: '',
      drawer: false,
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      },
      tableData: [
        {
          orderNum: 123
        }
      ]
    }
  },
  methods: {
    issueInvoice () {
      this.$router.push('/finance-center/invoice-issue')
    },
    /**
     * @description 查询数据
     */
    searchData () {
      // TODO
    },
    handleCurrentChange () {
      // TODO 更新页面
    },
    /**
     * @description 显示详情
     */
    showDetail () {
      this.drawer = true
    }
  }
}
</script>

<style lang="less" scoped>
.finance-index {
  margin-top: 24px;

  .header-plugin {
    .el-button {
      float: right;
      margin: 40px 24px 0 0;
    }
  }

  .search-box {
    margin-bottom: 0;

    .button-box {
      margin-bottom: 20px;
    }
  }

  .earnings-info {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1769ff;
  }

  .table-box {
    .state-box {
      display: flex;
      align-items: center;

      .point {
        width: 6px;
        height: 6px;
        margin-right: 8px;
        background-color: #eee;
        border-radius: 50%;

        &--success {
          background-color: #52c41a;
        }

        &--warning {
          background-color: #fbd211;
        }

        &--danger {
          background-color: #e64049;
        }
      }
    }
  }
}
</style>

<style lang="less">
.invoice-class {
  border-radius: 10px 0 0 10px;

  .el-drawer__header {
    padding: 24px;
    margin-bottom: 26px;
    background-color: #f0f2f5;

    span {
      font-size: 24px;
      font-weight: 500;
      color: #303133;
    }

    .el-drawer__close-btn {
      color: #303133;
    }
  }

  .el-drawer__body {
    overflow: overlay;
  }
}
</style>
