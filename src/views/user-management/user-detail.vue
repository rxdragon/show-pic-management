<template>
  <div class="user-detail module-page-box">
    <user-info :user-data="userData" class="module-panel"></user-info>
    <!-- 消费详情 -->
    <div class="user-order-list module-panel">
      <div class="panel-title">消费详情</div>
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="orderNum" fixed="left" label="订单号" width="180" />
          <el-table-column label="产品名称" min-width="200">
            <template slot-scope="{ row }">
              {{ row.productShow || '-' }}
              <el-popover v-if="row.productShow" placement="bottom-start" trigger="hover">
                <div class="order-info">
                  <p
                    v-for="(productItem, productIndex) in row.productList"
                    :key="productIndex"
                  >
                    {{ productItem }}
                  </p>
                  <p>照片张数：{{ row.photoNum }}张</p>
                </div>
                <i slot="reference" class="product-more iconfont icongengduo"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="消费金额" width="180">
            <template slot-scope="{ row }">
              <p class="money-desc"><span>订单总金额：</span>{{ row.allPrice | stringMoney }}</p>
              <p class="money-desc"><span>订单优惠金额：</span>{{ row.discountsPrice | stringMoney }}</p>
              <p class="money-desc"><span>订单实付金额：</span>{{ row.totalFee | stringMoney }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="photoNum" label="照片数量" />
          <el-table-column prop="stateCN" label="订单状态" />
          <el-table-column label="订单来源" >
            <template slot-scope="{ row }">
              <div :class="`${row.orderFrom}-color`">{{ row.orderFrom | toOrderFromToCN }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="paidAt" label="下单时间" width="180" />
          <el-table-column label="操作" fixed="right" align="right" width="100">
            <template slot-scope="{ row }">
              <el-button v-if="row.orderState !== ORDER_STATE.CANCELLED" type="primary" size="small" @click="goToDetail(row.id)">
                订单详情
              </el-button>
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
import { ORDER_STATE } from '@/model/Enumerate.js'
import * as Clients from '@/api/clients'
import * as Order from '@/api/order.js'

export default {
  name: 'userDetail',
  components: { UserInfo },
  data () {
    return {
      ORDER_STATE,
      tableData: [],
      userData: {},
      userId: '',
      pager: {
        page: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  created () {
    this.userId = this.$route.query.userId
    this.initPage()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 根据路由名字
      if (from.name === 'UserManage') {
        vm.userId = vm.$route.query.userId
        vm.initPage()
      }
    })
  },
  methods: {
    /**
     * @description 初始化订单信息
     */
    async initPage () {
      try {
        this.$loading()
        Promise.all([
          this.getUserInfo(),
          this.getUserConsumeList(1)
        ])
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 获取用户下单列表
     */
    async getUserInfo () {
      const req = { id: this.userId }
      this.userData = await Clients.getOrderDetail(req)
    },
    /**
     * @description 获取用户下单列表
     */
    async getUserConsumeList (page) {
      this.pager.page = page === 1 ? page : this.pager.page
      const req = {
        cond: { userId: this.userId },
        page: this.pager.page,
        pageSize: this.pager.pageSize
      }
      const data = await Order.getOrderList(req)
      this.pager.total = data.total
      this.tableData = data.list
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
     * @description 监听分页
     */
    async handleCurrentChange () {
      try {
        this.$loading()
        await this.getUserConsumeList()
      } finally {
        this.$loadingClose()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-detail {
  margin-top: 24px;

  .user-order-list {
    margin-top: 20px;

    .table-box {
      margin-top: 24px;

      .money-desc {
        & > span {
          display: inline-block;
          width: 100px;
        }
      }
    }
  }
}
</style>
