<template>
  <div class="order-management module-page-box">
    <main class="module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <span>下单时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="date-search search-item">
          <el-input v-model.trim="orderSearchValue" placeholder="请输入内容" class="input-with-select">
            <el-select slot="prepend" v-model="orderSeachType" placeholder="请选择">
              <el-option label="订单号" value="orderNum" />
              <el-option label="顾客姓名" value="userName" />
              <el-option label="顾客手机号" value="phone" />
            </el-select>
          </el-input>
        </div>
        <div class="date-search search-item">
          <span>订单状态</span>
          <order-state-select v-model="orderState" />
        </div>
        <div class="date-search search-item">
          <span>订单来源</span>
          <order-source-select v-model="orderSource" />
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="initPage(1)">查 询</el-button>
          <el-button type="blue" size="small" @click="outExecl">导 出</el-button>
        </div>
      </div>
      <!-- 收益信息 -->
      <div class="earnings-info">
        <span class="total-count">当前查询条件下：共{{ earningsInfo.totalCount }}单</span>
        <span>总计收益：¥{{ earningsInfo.incomeMoney }}</span>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column label="订单号" width="180">
             <template slot-scope="{ row }">
               <el-popover
                  placement="bottom-start"
                  trigger="hover">
                  <div class="order-info">
                    <p>顾客姓名：{{ row.clientName }}</p>
                    <p>手机：{{ row.clientPhone }}</p>
                    <p>照片张数：{{ row.photoNum }}张</p>
                  </div>
                  <div slot="reference" class="order-num">{{ row.orderNum }}</div>
                </el-popover>
             </template>
          </el-table-column>
          <el-table-column label="下单产品">
            <template slot-scope="{ row }">
              {{ row.productShow || '-' }}
              <el-popover
                  v-if="row.productShow"
                  placement="bottom-start"
                  trigger="hover">
                  <div class="order-info">
                    <p v-for="(productItem, productIndex) in row.productList" :key="productIndex">{{ productItem }}</p>
                    <p>照片张数：{{ row.photoNum }}张</p>
                  </div>
                  <i slot="reference" class="product-more iconfont icongengduo"></i>
                </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="totalFee" label="金额" width="150" :formatter="stringMoney"/>
          <el-table-column prop="stateCN" label="状态" width="100" />
          <el-table-column label="订单来源" width="80">
            <template slot-scope="{ row }">
              <div :class="`${row.orderFrom}-color`">{{ row.orderFrom | toOrderFromToCN }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="paidAt" label="下单时间" width="180" />
          <el-table-column label="操作" align="right" width="100">
            <template slot-scope="{ row }">
              <el-dropdown trigger="click">
                <el-button type="primary" size="small">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="goToDetail(row.id)">订单详情</el-dropdown-item>
                  <el-dropdown-item v-if="row.orderState !== ORDER_STATE.CLOSED" @click.native="closeOrder(row.id)">关闭订单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    <!-- 订单关闭详情 -->
    <el-dialog
      title="订单关闭原因"
      :visible="Boolean(closeOrderId)"
      :show-close="false" top="50vh"
      custom-class="close-dialog" width="30%" center>
      <div class="close-desc">
        <el-input
          type="textarea"
          placeholder="请填写订单关闭原因，最多100字符。"
          v-model="closeMessage"
          rows="6"
          maxlength="100"
          show-word-limit />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="resetCloseInfo">取 消</el-button>
        <el-button type="primary" size="small" :loading="submitCloseLoading" @click="submitCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import NoData from '@/components/NoData'
import OrderStateSelect from '@selectBox/OrderStateSelect'
import OrderSourceSelect from '@selectBox/OrderSourceSelect'
import { toFixedNoRound } from '@/utils/validate.js'
import { ORDER_STATE } from '@/model/Enumerate.js'
import { getSeachTime } from '@/utils/timeUtil.js'
import { exportExcel } from '@/utils/exportExcelUtil.js'
import * as Order from '@/api/order.js'

export default {
  name: 'orderManagement',
  components: { DatePicker, OrderStateSelect, OrderSourceSelect, NoData },
  data () {
    return {
      ORDER_STATE, // 订单状态
      timeSpan: null, // 时间节点
      orderState: '', // 订单状态
      orderSource: '', // 订单来源
      closeOrderId: 0, // 关闭订单id,
      closeMessage: '', // 关闭订单理由
      submitCloseLoading: false, // 提交加载
      orderSeachType: 'orderNum', // 查询类型 orderNum 订单号 userName 顾客姓名 phone 顾客手机号
      orderSearchValue: '',
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      },
      tableData: [], // 订单数据
      earningsInfo: { // 收益信息
        totalCount: 0,
        incomeMoney: 0
      }
    }
  },
  created () {
    this.initPage(1)
  },
  methods: {
    /**
     * @description 初始化页面
     */
    async initPage (page) {
      try {
        this.$loading()
        await this.searchData(page)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 订单搜索
     */
    async searchData (page) {
      this.pager.page = page === 1 ? page : this.pager.page
      const req = {
        cond: {},
        page: this.pager.page,
        pageSize: this.pager.pageSize
      }
      if (this.timeSpan) { req.cond.createdAtRange = getSeachTime(this.timeSpan) }
      if (this.orderSearchValue) { req.cond[this.orderSeachType] = this.orderSearchValue }
      if (this.orderState) {
        const [key, value] = this.orderState.split(',')
        req.cond[key] = value
      }
      if (this.orderSource) { req.cond.from = this.orderSource }
      const data = await Order.getOrderList(req)
      this.tableData = data.list
      this.pager.total = data.total
      this.earningsInfo.totalCount = data.total
      this.earningsInfo.incomeMoney = data.sumIncome
    },
    /**
     * @description 调整到详情页面
     */
    goToDetail (orderId) {
      this.$router.push({
        path: '/order-management/order-detail',
        query: { orderId }
      })
    },
    /**
     * @description 关闭订单
     */
    async closeOrder (id) {
      this.closeOrderId = id
    },
    /**
     * @description 提交关闭理由
     */
    async submitCloseOrder () {
      try {
        if (!this.closeMessage) return this.$newMessage.warning('请填写订单关闭原因!')
        this.submitCloseLoading = true
        const req = {
          id: this.closeOrderId,
          reason: this.closeMessage
        }
        await Order.closeOrder(req)
        this.$newMessage.success('关单成功')
        this.resetCloseInfo()
        this.initPage()
      } catch (error) {
        throw new Error(error)
      } finally {
        this.submitCloseLoading = false
      }
    },
    /**
     * @description 重制退回原因
     */
    resetCloseInfo () {
      this.closeOrderId = 0
      this.closeMessage = ''
    },
    /**
     * @description 页数变更
     */
    handleCurrentChange () {
      try {
        this.$loading()
        this.searchData()
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 格式化金钱
     */
    stringMoney (row, column, cellValue, index) {
      const money = toFixedNoRound(cellValue)
      return `¥${money}`
    },
    /**
     * @description 导出表格
     */
    async outExecl () {
      try {
        this.$loading()
        const req = { cond: {} }
        if (this.timeSpan) { req.cond.createdAtRange = getSeachTime(this.timeSpan) }
        if (this.orderSearchValue) { req.cond[this.orderSeachType] = this.orderSearchValue }
        if (this.orderState) {
          const [key, value] = this.orderState.split(',')
          req.cond[key] = value
        }
        if (this.orderSource) { req.cond.from = this.orderSource }
        const timeString = this.timeSpan ? this.timeSpan.join('~') : '全部'
        const data = await Order.exportExcel(req)
        const excelName = timeString + '修修兽订单'
        const headerCellName = ['订单号', '下单时间', '照片数量', '金额', '状态', '用户账号', '用户姓名', '联系电话', '下单产品', '产品数量']
        const headerCellkeys = ['orderNum', 'paidAt', 'photoNum', 'totalFee', 'stateCN', 'clientAccount', 'clientName', 'clientPhone', 'productListString', 'productNum']
        exportExcel(data, excelName, headerCellName, headerCellkeys)
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
.order-management {
  margin-top: 24px;

  .search-box {
    margin-bottom: 0;

    .input-with-select {
      & /deep/ .el-input__inner {
        width: 240px;
      }

      & /deep/ .el-input-group__prepend .el-input__inner {
        width: 120px;
      }
    }

    .button-box {
      margin-bottom: 20px;
    }
  }

  .earnings-info {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1769ff;

    .total-count {
      margin-right: 20px;
    }
  }

  .table-box {
    margin-top: 24px;

    .product-more {
      color: #909399;
    }
  }
}
</style>

<style lang="less">
.close-dialog {
  transform: translateY(-50%);

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    padding-top: 0;
  }
}
</style>
