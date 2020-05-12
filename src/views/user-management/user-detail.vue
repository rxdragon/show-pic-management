<template>
  <div class="user-detail">
    <user-info class="module-panel"></user-info>
    <!-- 消费详情 -->
    <div class="user-order-list module-panel">
      <div class="panel-title">消费详情</div>
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="orderNum" label="订单号" width="180" />
          <el-table-column prop="orderNum" label="产品名称" width="180" />
          <el-table-column prop="orderNum" label="消费金额" />
          <el-table-column prop="orderNum" label="照片数量" />
          <el-table-column prop="orderNum" label="订单状态" />
          <el-table-column prop="orderNum" label="订单来源" />
          <el-table-column prop="orderCreateTime" label="下单时间" />
          <el-table-column label="操作" align="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="goToDetail(scope.row.id)">订单详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
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
import UserInfo from './components/UserInfo'

export default {
  name: 'user-detail',
  components: { UserInfo },
  data () {
    return {
      tableData: [{
        orderNum: 'asdas'
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
     * @description 调整到详情页面
     */
    goToDetail () {
      this.$router.push('/order-management/order-detail')
    },
    /**
     * @description 监听分页
     */
    handleCurrentChange () {
      // TODO 分页数据
    }
  }
}
</script>

<style lang="less" scoped>
.user-detail {
  margin-top: 24px;

  .user-order-list {
    margin-top: 20px;
  }
}
</style>
