<template>
  <div class="user-info">
    <div class="panel-title">订单信息</div>
    <div class="info-table">
      <table border="0">
        <tr class="title">
          <th>用户姓名</th>
          <th>手机号</th>
          <th>性别</th>
          <th>消费频次</th>
          <th>消费总金额</th>
          <th>最近消费时间</th>
          <th>账号来源</th>
        </tr>
        <tr class="order-data">
          <th>付小小</th>
          <th>18100000000</th>
          <th>女</th>
          <th>2次</th>
          <th>¥200.00</th>
          <th>2019-09-09 13:00:00</th>
          <th>海马体</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data () {
    return {
    }
  }
}
</script>

<style lang="less" scoped>
.user-info {
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
