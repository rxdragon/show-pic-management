<template>
  <div class="user-management module-page-box">
    <main class="module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <span>创建时间</span>
          <date-picker v-model="timeSpan" />
        </div>
        <div class="date-search search-item">
          <el-input
            v-model.trim="searchValue"
            placeholder="请输入内容"
            class="input-with-select"
            @keyup.native.enter="searchData(1)"
          >
            <el-select slot="prepend" v-model="seachType" placeholder="请选择">
              <el-option label="顾客姓名" value="userName" />
              <el-option label="顾客手机号" value="phone" />
            </el-select>
          </el-input>
        </div>
        <div class="date-search search-item">
          <span>账号来源</span>
          <account-source-select v-model="accountSource" />
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData(1)">查 询</el-button>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-show="tableData.length">
        <el-table :data="tableData" style="width: 100%;"  @sort-change="onSortChange">
          <el-table-column prop="phone" label="手机号" width="180" />
          <el-table-column prop="name" label="用户姓名" width="180" />
          <el-table-column prop="sex" label="用户性别" />
          <el-table-column prop="userConsumeNum" label="消费次数" sortable="custom" />
          <el-table-column
            prop="consumeTotal"
            label="消费金额"
            sortable="custom"
            :formatter="stringMoney"
          />
          <el-table-column label="账号来源">
            <template slot-scope="{ row }">
              <div :class="`${row.from}-color`">{{ row.from | toOrderFromToCN }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="userDetail(scope.row.id)">用户详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <no-data v-show="!tableData.length">当前暂无用户</no-data>
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
import { getSeachTime } from '@/utils/timeUtil.js'
import * as Clients from '@/api/clients'

export default {
  name: 'userManage',
  components: { DatePicker, AccountSourceSelect, NoData },
  data () {
    return {
      timeSpan: null, // 创建时间
      accountSource: '', // 用户来源
      seachType: 'userName', // 查询类型 userName 顾客姓名 phone 手机号
      searchValue: '', // 搜索值
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      },
      tableData: [],
      orderBy: {
        key: null,
        sort: null
      }
    }
  },
  created () {
    this.searchData(1)
  },
  methods: {
    /**
     * @description 搜索信息
     */
    async searchData (page) {
      try {
        this.$loading()
        this.pager.page = page === 1 ? page : this.pager.page
        const req = {
          cond: {},
          page: this.pager.page,
          pageSize: this.pager.pageSize
        }
        if (this.timeSpan) {
          req.cond.createdAtRange = getSeachTime(this.timeSpan)
        }
        if (this.searchValue) {
          req.cond[this.seachType] = this.searchValue
        }
        if (this.accountSource) {
          req.cond.from = this.accountSource
        }
        if (this.orderBy.key) {
          req.orderBy = this.orderBy
        }
        const data = await Clients.getOrderList(req)
        this.tableData = data.list
        this.pager.total = data.total
      } catch (error) {
        throw new Error(error)
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 监听排序变化
     */
    onSortChange (e) {
      const orderSort = {
        descending: 'desc', // 降序
        ascending: 'asc' // 升序
      }
      const orderSortKey = {
        userConsumeNum: 'consume_num',
        consumeTotal: 'consume_total'
      }
      this.orderBy = {
        key: orderSortKey[e.prop],
        sort: orderSort[e.order]
      }
      this.searchData()
    },
    /**
     * @description 调整到详情页面
     */
    userDetail (userId) {
      this.$router.push({
        path: '/user-management/user-detail',
        query: { userId }
      })
    },
    /**
     * @description 页数变更
     */
    handleCurrentChange () {
      this.searchData()
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
