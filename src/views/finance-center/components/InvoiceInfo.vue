<template>
  <div class="invoice-info">
    <!-- 发票信息 -->
    <div class="invoice-info-module">
      <div class="panel-title">
        发票详情
        <div class="right-flow state-box">
          <div class="point point--success"></div>
          <span class="state-text">开具完成</span>
        </div>
      </div>
      <div class="pancel-content" v-for="(invoiceItem, invoiceIndex) in invoiceInfo" :key="invoiceIndex">
        <div class="label-class">{{ invoiceItem.label }}</div>
        <div class="value">{{ invoiceItem.value }}</div>
      </div>
    </div>
    <div class="ticket-info-module">
      <div class="panel-title">收票信息</div>
      <div class="pancel-content" v-for="(ticketItem, ticketIndex) in ticketInfo" :key="ticketIndex">
        <div class="label-class">{{ ticketItem.label }}</div>
        <div class="value">{{ ticketItem.value }}</div>
      </div>
      <div class="ticket-image">
        <el-image :src="ticketImage" @click="showTicketImage" />
      </div>
    </div>
    <div class="button-box">
      <el-button type="danger" @click="cancellationTicket">作废</el-button>
      <el-button type="primary" @click="showTicketImage">查看电子发票</el-button>
    </div>
    <el-dialog
      title="查看电子发票" :modal="false" custom-class="ticket-show"
      :visible.sync="showViewer" center width="860px">
      <el-image class="ticket-image-box" :src="ticketImage" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">重新发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InvoiceInfo',
  data () {
    return {
      showViewer: false,
      invoiceInfo: [
        {
          label: '发票类型：',
          value: '电子普通发票'
        },
        {
          label: '抬头类型：',
          value: '单位'
        },
        {
          label: '发票抬头：',
          value: '杭州缦图摄影有限公司'
        },
        {
          label: '注册地址：',
          value: '浙江省杭州市江干区白杨街道XXXXXXX'
        }
      ],
      ticketInfo: [
        {
          label: '手机号：',
          value: '13325811273'
        },
        {
          label: '邮箱：',
          value: '13325811273@163.com'
        }
      ],
      ticketImage: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
    }
  },
  methods: {
    /**
     * @description 显示电子发票预览图
     */
    showTicketImage () {
      this.showViewer = true
    },
    /**
     * @description 作废
     */
    cancellationTicket () {
      // TODO
    }
  }
}
</script>

<style lang="less" scoped>
.invoice-info {
  padding: 0 24px;

  .panel-title {
    margin-bottom: 8px;

    .state-box {
      display: flex;
      align-items: center;
      margin-right: 8px;

      .point {
        width: 6px;
        height: 6px;
        margin-right: 8px;
        background-color: #eee;
        border-radius: 50%;

        &--success {
          background-color: #52c41a;
        }

        &--warning {
          background-color: #fbd211;
        }

        &--danger {
          background-color: #e64049;
        }
      }

      .state-text {
        font-size: 14px;
        font-weight: 400;
        color: #303133;
      }
    }
  }

  .pancel-content {
    display: flex;
    font-size: 14px;
    font-weight: 400;
    color: #303133;

    .label-class {
      width: 70px;
    }
  }

  .invoice-info-module {
    margin-bottom: 20px;
  }

  .ticket-info-module {
    margin-bottom: 40px;

    .ticket-image {
      margin-top: 24px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;

      .el-image {
        display: block;
      }
    }
  }

  .button-box {
    .el-button + .el-button {
      margin-left: 24px;
    }
  }
}
</style>

<style lang="less">
.ticket-show {
  .el-dialog__header {
    padding-bottom: 0;
  }

  .el-dialog__footer {
    padding-top: 4px;

    .el-button {
      width: 124px;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .ticket-image-box {
    display: block;
    margin: auto;
  }
}
</style>
