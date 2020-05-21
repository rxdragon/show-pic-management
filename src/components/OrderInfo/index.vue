<template>
  <div class="order-info">
    <div class="panel-title">订单信息</div>
    <div class="info-table">
      <table border="0">
        <tr class="title">
          <th>订单号</th>
          <th>下单时间</th>
          <th>下单产品</th>
          <th>实付金额</th>
          <th>用户账号</th>
          <th>用户姓名</th>
        </tr>
        <tr class="order-data">
          <th>{{ orderData.orderNum }}</th>
          <th>{{ orderData.paidAt }}</th>
          <th>
            {{ orderData.productShow || '-' }}
            <el-popover v-if="orderData.productShow" placement="bottom-start" trigger="hover">
              <div class="order-info">
                <p
                  v-for="(productItem, productIndex) in orderData.productList"
                  :key="productIndex"
                >
                  {{ productItem }}
                </p>
                <p>照片张数：{{ orderData.photoNum }}张</p>
              </div>
              <i slot="reference" class="product-more iconfont icongengduo"></i>
            </el-popover>
          </th>
          <th>¥{{ orderData.totalFee }}</th>
          <th>{{ orderData.clientAccount }}</th>
          <th>{{ orderData.clientName }}</th>
        </tr>
        <tr class="title">
          <th>联系电话</th>
          <th>订单状态</th>
          <th>操作人</th>
          <th colspan="3">关闭原因</th>
        </tr>
        <tr class="order-data">
          <th>{{ orderData.clientPhone }}</th>
          <th>{{ orderData.stateCN }}</th>
          <th>{{ orderData.closeOperator }}</th>
          <th class="close-reason" colspan="3">{{ orderData.closeReason }}</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OrderInfo',
  props: {
    orderInfo: { type: Object, required: true }
  },
  data () {
    return {
    }
  },
  computed: {
    orderData () {
      return this.orderInfo || {}
    }
  }
}
</script>

<style lang="less" scoped>
.order-info {
  .info-table {
    margin-top: 20px;

    table {
      width: 100%;
      text-align: left;
      border-collapse: collapse;

      tr {
        border-bottom: 1px solid #f2f6fc;
      }

      th {
        padding: 17px 20px;
      }

      .title {
        th {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          background-color: #fafafa;
        }
      }

      .order-data {
        th {
          font-size: 14px;
          font-weight: 400;
          color: #606266;
        }

        .close-reason {
          max-width: 400px;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
