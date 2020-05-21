<template>
  <div class="user-info">
    <div class="panel-title">用户信息</div>
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
          <th>{{ userData.name }}</th>
          <th>{{ userData.phone }}</th>
          <th>{{ userData.sex }}</th>
          <th>{{ userData.userConsumeNum }}次</th>
          <th>¥{{ userData.consumeTotal }}</th>
          <th>{{ userData.recentlyConsume }}</th>
          <th :class="`${userData.from}-color`">{{ userData.from | toOrderFromToCN }}</th>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    userData: { type: Object, required: true }
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
