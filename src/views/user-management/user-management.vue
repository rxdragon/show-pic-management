<template>
  <div class="user-management">
    <main class="module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <span>创建时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="date-search search-item">
          <el-input v-model.trim="orderSearchValue" placeholder="请输入内容" class="input-with-select">
            <el-select slot="prepend" v-model="orderSeachType" placeholder="请选择">
              <el-option label="顾客姓名" :value="1" />
              <el-option label="顾客手机号" :value="2" />
            </el-select>
          </el-input>
        </div>
        <div class="date-search search-item">
          <span>账号来源</span>
          <account-source-select v-model="accountSource" />
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData">查 询</el-button>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;"  @sort-change="onSortChange">
          <el-table-column prop="orderNum" label="手机号" width="180" />
          <el-table-column prop="orderNum" label="用户姓名" width="180" />
          <el-table-column prop="orderNum" label="用户性别" />
          <el-table-column prop="orderNum" label="消费次数" sortable="custom" />
          <el-table-column prop="orderNum" label="消费金额" sortable="custom" :formatter="stringMoney"/>
          <el-table-column prop="money" label="账号来源" />
          <el-table-column prop="orderCreateTime" label="创建时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="userDetail(scope.row.id)">用户详情</el-button>
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
import AccountSourceSelect from '@selectBox/AccountSourceSelect'

export default {
  name: 'UserManagement',
  components: { DatePicker, AccountSourceSelect, NoData },
  data () {
    return {
      timeSpan: null,
      orderState: '',
      accountSource: '',
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
     * @description 监听排序变化
     */
    onSortChange (e) {
      console.warn(e)
    },
    /**
     * @description 调整到详情页面
     */
    userDetail () {
      this.$router.push('/user-management/user-detail')
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
.user-management {
  margin-top: 24px;

  .search-box {
    margin-bottom: 0;

    .input-with-select {
      & /deep/ .el-input__inner {
        width: 170px;
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
