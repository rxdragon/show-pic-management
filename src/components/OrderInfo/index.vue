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
          <th>C2019070514006861</th>
          <th>2020-02-02 13:00:00</th>
          <th>海马体大师-女神照-月光</th>
          <th>¥200.00</th>
          <th>13329822102</th>
          <th>张三</th>
        </tr>
        <tr class="title">
          <th>联系电话</th>
          <th>订单状态</th>
          <th>操作人</th>
          <th colspan="3">关闭原因</th>
        </tr>
        <tr class="order-data">
          <th>13327899876</th>
          <th>已关闭</th>
          <th>班纳</th>
          <th colspan="3">撒打算打算打算打算打算打算打算打算打算打</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderInfo',
  data () {
    return {
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
      }
    }
  }
}
</style>
