<template>
  <div class="order-management">
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
              <el-option label="订单号" :value="1" />
              <el-option label="顾客姓名" :value="2" />
              <el-option label="顾客手机号" :value="3" />
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
          <el-button type="primary" size="small" @click="searchData">查 询</el-button>
          <el-button type="success" size="small">导 出</el-button>
        </div>
      </div>
      <!-- 收益信息 -->
      <div class="earnings-info">
        当前查询条件下：共5单    总计收益：¥1000.00
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="" label="订单号" width="180">
             <template slot-scope="{ row }">
               <el-popover
                  placement="bottom-start"
                  trigger="hover">
                  <div class="order-info">
                    <p>顾客姓名：xxxx</p>
                    <p>手机：xxxx</p>
                    <p>照片张数：2张</p>
                  </div>
                  <div slot="reference" class="order-num">{{ row.orderNum }}</div>
                </el-popover>
             </template>
          </el-table-column>
          <el-table-column prop="productList" label="下单产品" width="180">
            <template slot-scope="{ row }">
              {{ row.productList }}
              <el-popover
                  placement="bottom-start"
                  trigger="hover">
                  <div class="order-info">
                    <p>顾客姓名：xxxx</p>
                    <p>手机：xxxx</p>
                    <p>照片张数：2张</p>
                  </div>
                  <i slot="reference" class="product-more el-icon-s-unfold"></i>
                </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="金额" :formatter="stringMoney"/>
          <el-table-column prop="orderState" label="状态" />
          <el-table-column prop="orderCreateTime" label="下单时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-dropdown>
                <el-button type="primary" size="small">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="goToDetail(scope.row.id)">订单详情</el-dropdown-item>
                  <el-dropdown-item @click.native="closeOrder">关闭订单</el-dropdown-item>
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
  </div>
</template>

<script>
import DatePicker from '@/components/DatePicker'
import NoData from '@/components/NoData'
import OrderStateSelect from '@selectBox/OrderStateSelect'
import OrderSourceSelect from '@selectBox/OrderSourceSelect'

export default {
  name: 'orderManagement',
  components: { DatePicker, OrderStateSelect, OrderSourceSelect, NoData },
  data () {
    return {
      timeSpan: null,
      orderState: '',
      orderSource: '',
      orderSeachType: 1, // 查询类型 1 云端流水号 2 订单号 3 顾客姓名 4 手机号
      orderSearchValue: '',
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
    searchData () {
      if (!this.timeSpan) return this.$newMessage.warning('请输入时间')
      // const req = {
      //   startTime: this.timeSpan[0],
      //   endTime: this.timeSpan[1],
      //   orderState: this.orderState,
      //   orderSource: this.orderSource
      // }
    },
    /**
     * @description 调整到详情页面
     */
    goToDetail () {
      this.$router.push('/order-management/order-detail')
    },
    /**
     * @description 关闭订单
     */
    closeOrder () {
      // TODO
    },
    /**
     * @description 页数变更
     */
    handleCurrentChange () {
      // TODO
    },
    /**
     * @description 格式化金钱
     */
    stringMoney (row, column, cellValue, index) {
      const money = Number(cellValue).toFixed(2)
      return `¥${money}`
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
  }

  .table-box {
    .product-more {
      color: #909399;
    }
  }
}
</style>
