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
          <el-button type="success" size="small">查询</el-button>
          <el-button type="primary" size="small">导出</el-button>
        </div>
      </div>
      <!-- 收益信息 -->
      <div class="earnings-info">
        当前查询条件下：共5单    总计收益：¥1000.00
      </div>
      <!-- 订单列表 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;" @sort-change="onSortChange" >
          <el-table-column prop="orderNum" label="订单号" sortable="custom" width="180" />
          <el-table-column prop="productList" label="下单产品" sortable="custom" width="180" />
          <el-table-column prop="money" label="金额" />
          <el-table-column prop="orderState" label="状态" />
          <el-table-column prop="orderCreateTime" label="下单时间" />
          <el-table-column label="操作">
            <template>
              <el-dropdown>
                <el-button type="success" size="small">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>订单详情</el-dropdown-item>
                  <el-dropdown-item>关闭订单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
import OrderStateSelect from '@selectBox/OrderStateSelect'
import OrderSourceSelect from '@selectBox/OrderSourceSelect'

export default {
  name: 'orderManagement',
  components: { DatePicker, OrderStateSelect, OrderSourceSelect },
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
      tableData: [{
        orderNum: '2016-05-02',
        productList: '王小虎',
        money: '200',
        orderState: '完成',
        orderCreateTime: '2020-05-20'
      }, {
        orderNum: '2016-05-04',
        productList: '王小虎',
        money: '200',
        orderState: '完成',
        orderCreateTime: '2020-05-20'
      }, {
        orderNum: '2016-05-01',
        productList: '王小虎',
        money: '200',
        orderState: '完成',
        orderCreateTime: '2020-05-20'
      }, {
        orderNum: '2016-05-03',
        productList: '王小虎',
        money: '200',
        orderState: '完成',
        orderCreateTime: '2020-05-20'
      }]
    }
  },
  methods: {
    goto () {
      this.$router.push('/order-management/order-detail')
    },
    handleCurrentChange () {
      // TODO
    },
    /**
     * @description 监听排序变化
     */
    onSortChange (e) {
      // TODO
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
      & /deep/ .el-select {
        width: 100px;
      }

      & /deep/ .el-input__inner {
        width: 240px;
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
}
</style>
