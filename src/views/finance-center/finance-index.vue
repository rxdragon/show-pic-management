<template>
  <div class="finance-index">
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
          <el-input v-model.trim="invoiceTitle" @keyup.native.enter="searchData(1)" placeholder="请输入" class="input-with-select"></el-input>
        </div>
        <div class="date-search search-item">
          <span>开票状态</span>
          <invoice-state-select v-model="invoiceState" />
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData(1)">查 询</el-button>
          <el-button type="success" size="small" @click="outExcel">导 出</el-button>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="invoicedate" label="开票时间" />
          <el-table-column prop="proposerAccount" label="申请人账号" />
          <el-table-column prop="titleType" label="抬头类型" :formatter="stringInvoiceTitle" />
          <el-table-column prop="invoiceTitle" label="发票抬头" />
          <el-table-column prop="price" label="发票金额" :formatter="stringMoney" />
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <div class="state-box">
                <div class="point" :class="`point--${row.state}`"></div>
                <span class="state-text">{{ row.stateToCN }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="right">
            <template slot-scope="{ row }">
              <el-button type="primary" size="small" @click="showDetail(row)">详情</el-button>
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
      <invoice-info :invoice-data="invoiceData" />
    </el-drawer>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import NoData from '@/components/NoData'
import InvoiceStateSelect from '@selectBox/InvoiceStateSelect'
import InvoiceInfo from './components/InvoiceInfo'
import { getSeachTime } from '@/utils/timeUtil.js'
import { toFixedNoRound } from '@/utils/validate.js'
import { Excel } from 'mainto-fed-utils'
import * as Invoice from '@/api/invoice.js'

export default {
  name: 'financeIndex',
  components: { DatePicker, InvoiceStateSelect, NoData, InvoiceInfo },
  data () {
    return {
      timeSpan: null,
      invoiceState: '',
      orderSeachType: 1, // 查询类型 1 云端流水号 2 订单号 3 顾客姓名 4 手机号
      invoiceTitle: '',
      drawer: false,
      invoiceData: {}, // 电子发票
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
    issueInvoice () {
      this.$router.push('/finance-center/invoice-issue')
    },
    /**
     * @description 查询数据
     */
    async searchData (page) {
      try {
        this.$loading()
        this.pager.page = page === 1 ? page : this.pager.page
        const req = {
          page: this.pager.page,
          pageSize: this.pager.pageSize
        }
        if (this.timeSpan) {
          const filterTimeSpan = getSeachTime(this.timeSpan)
          req.startTime = filterTimeSpan[0]
          req.endTime = filterTimeSpan[1]
        }
        if (this.invoiceState) { req.invoiceState = this.invoiceState }
        if (this.invoiceTitle) { req.title = this.invoiceTitle }
        const data = await Invoice.getInvoiceList(req)
        this.tableData = data.list
        this.pager.total = data.total
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    handleCurrentChange () {
      this.searchData()
    },
    /**
     * @description 显示详情
     */
    showDetail (invoiceInfo) {
      this.invoiceData = invoiceInfo
      this.drawer = true
    },
    /**
     * @description 格式化金钱
     */
    stringMoney (row, column, cellValue, index) {
      const money = toFixedNoRound(cellValue)
      return `¥${money}`
    },
    /**
     * @description 发票类型
     */
    stringInvoiceTitle (row, column, cellValue, index) {
      const changeMap = {
        person: '个人',
        company: '单位'
      }
      return changeMap[cellValue] || '异常'
    },
    /**
     * @description 导出表格
     */
    async outExcel () {
      try {
        if (!this.timeSpan) return this.$newMessage.warning('请输入时间')
        this.$loading()
        const filterTimeSpan = getSeachTime(this.timeSpan)
        const req = {
          startTime: filterTimeSpan[0],
          endTime: filterTimeSpan[1],
          page: 1,
          pageSize: 1000
        }
        if (this.invoiceState) { req.invoiceState = this.invoiceState }
        if (this.invoiceTitle) { req.title = this.invoiceTitle }
        const timeString = this.timeSpan ? this.timeSpan.join('~') : '全部'
        const data = await Invoice.getInvoiceList(req)
        if (data.total > 1000) { this.$newMessage.warning('当前只能导出1000条数据') }
        const excelName = timeString + '修修兽发票开具记录'
        const headerCellName = ['开票时间', '申请人账号', '抬头类型', '发票抬头', '发票金额', '单位税号', '注册地址', '注册电话', '开户银行', '银行账号', '发票状态']
        const option = {
          header: [
            { 0: excelName },
            [...headerCellName]
          ],
          keys: ['invoicedate', 'proposerAccount', 'titleTypeCN', 'invoiceTitle', 'price', 'taxnum', 'saleaddress', 'salephone', 'bankName', 'bankaccount', 'stateToCN'],
          autoWidth: true
        }
        const excel = new Excel(data.list, option)
        const excelSave = excel.save()
        excelSave.tmpWB.Sheets.sheet['A1'].s = {
          font: { sz: 24, name: '微软雅黑' },
          alignment: {
            horizontal: 'center'
          }
        }
        excelSave.down(excelName)
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

        &--complete {
          background-color: #52c41a;
        }

        &--wait_write,
        &--pending {
          background-color: #fbd211;
        }

        &--invalid,
        &--fail {
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
