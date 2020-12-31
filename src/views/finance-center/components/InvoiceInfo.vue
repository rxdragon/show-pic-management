<template>
  <div class="invoice-info">
    <!-- 发票信息 -->
    <div class="invoice-info-module">
      <div class="panel-title">
        发票详情
        <div class="right-flow state-box">
          <div class="point" :class="`point--${invoiceData.state}`"></div>
          <span class="state-text">{{ invoiceData.stateToCN }}</span>
        </div>
      </div>
      <div
        class="pancel-content"
        v-for="(invoiceItem, invoiceIndex) in invoiceData.invoiceInfo"
        :key="invoiceIndex"
      >
        <div class="label-class">{{ invoiceItem.label }}</div>
        <div class="value" :class="invoiceItem.value === '电子普通发票' && 'red'">{{ invoiceItem.value }}</div>
      </div>
    </div>
    <div class="ticket-info-module">
      <div class="panel-title">收票信息</div>
      <div
        class="pancel-content"
        v-for="(ticketItem, ticketIndex) in invoiceData.ticketInfo"
        :key="ticketIndex"
      >
        <div class="label-class">{{ ticketItem.label || '-' }}</div>
        <div class="value">{{ ticketItem.value || '-' }}</div>
      </div>
      <div class="ticket-image" v-if="invoiceData.electronicInvoice">
        <iframe title="ticketImage" :src="ticketImage" @click="showTicketImage" />
      </div>
    </div>
    <div class="button-box">
      <el-button
        v-if="invoiceData.state === INVOICE_STATE.COMPLETE"
        type="danger"
        :loading="cancellLoading"
        @click="cancellationTicket"
      >
        作废
      </el-button>
      <el-button v-if="invoiceData.electronicInvoice" type="primary" @click="showTicketImage">查看电子发票</el-button>
    </div>
    <el-dialog
      title="查看电子发票"
      :modal="false"
      custom-class="ticket-show"
      :visible.sync="showViewer"
      center
      width="860px"
    >
      <iframe title="ticketImage" class="ticket-image-box" :src="ticketImage" />
      <span slot="footer" class="dialog-footer">
        <el-button :loading="resendLoading" type="primary" @click="resendInvoice">重新发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as Invoice from '@/api/invoice.js'
import { INVOICE_STATE, invalidToCN } from '@/model/Enumerate.js'

export default {
  name: 'InvoiceInfo',
  props: {
    invoiceData: { type: Object, required: true }
  },
  data () {
    return {
      INVOICE_STATE,
      showViewer: false,
      cancellLoading: false,
      resendLoading: false
    }
  },
  computed: {
    ticketImage () {
      return this.invoiceData.electronicInvoice
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
    async cancellationTicket () {
      try {
        this.cancellLoading = true
        const req = { id: this.invoiceData.id }
        await Invoice.voidInvoice(req)
        this.invoiceData.state = INVOICE_STATE.INVALID
        this.invoiceData.stateToCN = invalidToCN[INVOICE_STATE.INVALID]
      } finally {
        this.cancellLoading = false
      }
    },
    /**
     * @description 重新发送
     */
    async resendInvoice () {
      try {
        if (!this.invoiceData.ticketPhone && !this.invoiceData.ticketEmail) return this.$newMessage.warning('获取收票信息失败')
        this.resendLoading = true
        const req = {
          invoiceId: this.invoiceData.id,
          phone: this.invoiceData.ticketPhone,
          email: this.invoiceData.ticketEmail
        }
        await Invoice.resendInvoice(req)
      } finally {
        this.resendLoading = false
      }
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

        &--complete {
          background-color: #52c41a;
        }

        &--wait_write,
        &--pending {
          background-color: #fbd211;
        }

        &--invalid,
        &--fail {
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
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #303133;

    .label-class {
      width: 70px;
    }

    .red {
      color: @red;
    }
  }

  .invoice-info-module {
    margin-bottom: 20px;
  }

  .ticket-info-module {
    margin-bottom: 40px;

    .ticket-image {
      height: 260px;
      margin-top: 24px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;

      iframe {
        width: 100%;
        height: 100%;
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
    width: 100%;
    height: 642px;
    margin: auto;
  }
}
</style>
