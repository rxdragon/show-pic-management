<template>
  <div class="invoice-issue">
    <div class="order-select-module module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <el-input v-model.trim="orderSearchValue" placeholder="请输入内容" @keyup.native.enter="searchData" class="input-with-select">
            <el-select slot="prepend" v-model="orderSeachType" placeholder="请选择">
              <el-option label="顾客手机号" value="phone" />
              <el-option label="订单号" value="orderNum" />
            </el-select>
          </el-input>
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData">查 询</el-button>
        </div>
        <div class="max-invoice-money button-box">
          本次最大可开票金额：¥{{ maxInvoiceMoney | filtermoney }}
          本次最小可开票金额：¥{{ minInvoiceMoney | filtermoney }}
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box" v-loading="orderListLoading">
        <el-table :data="tableData" style="width: 100%;" height="250" :row-class-name="tableRowClassName">
          <el-table-column prop="orderNum" label="订单号" />
          <el-table-column label="产品">
            <template slot-scope="{ row }">
              {{ row.productList[0] || '-' }}
              <el-popover v-if="row.productList[0]" placement="bottom-start" trigger="hover">
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
          <el-table-column prop="canInvoiceMoney" label="可开票金额" :formatter="stringMoney"/>
          <el-table-column prop="invoiceStateCN" label="开票状态" />
          <el-table-column align="right" width="100" >
            <template slot="header" slot-scope="{ row }">
              <span class="table-header" :id="row">操作</span>
            </template>
            <template slot-scope="{ row }" v-if="row.canCheck">
              <el-checkbox @change="onCheckChange" v-model="row.isCheck"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="checkOrder.length">
      <div class="issue-info-form module-panel">
        <div class="panel-title">
          发票信息填写
          <el-button v-if="$isDev" class="right-flow" @click="devInput">mock</el-button>
        </div>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="80px"
          class="form-box"
          label-position="left"
        >
          <el-form-item label="抬头类型" prop="titleType">
            <el-select v-model="form.titleType" placeholder="请选择抬头类型">
              <el-option label="个人" value="person"></el-option>
              <el-option label="单位" value="company"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票抬头" prop="title">
            <el-input v-model="form.title" placeholder="请输入发票抬头"></el-input>
          </el-form-item>
          <el-form-item v-if="form.titleType === 'company'" label="单位税号" prop="taxNum">
            <el-input v-model="form.taxNum" placeholder="请输入单位税号"></el-input>
          </el-form-item>
          <!--当抬头类型为单位时显示 -->
          <template v-if="form.titleType === 'company'">
            <el-form-item label="注册地址" prop="address">
              <el-input v-model.trim="form.address" placeholder="请输入注册地址"></el-input>
            </el-form-item>
            <el-form-item label="注册电话" prop="telephone">
              <el-input v-model.trim="form.telephone" placeholder="请输入注册电话"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model.trim="form.bankName" placeholder="请输入开户银行"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input v-model.trim="form.bankAccount" placeholder="请输入银行账号"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="开票金额" prop="money" class="max-money-box">
            <el-input
              v-model.trim="form.money"
              type="Number"
              v-numberOnly
              min="1"
              :max="maxInvoiceMoney"
              placeholder="请输入开票金额"
            ></el-input>
            <div class="max-money">本次最大可开票金额：¥{{ maxInvoiceMoney | filtermoney }}</div>
            <div class="max-money">本次最小可开票金额：¥{{ minInvoiceMoney | filtermoney }}</div>
          </el-form-item>
          <div class="panel-title">收票信息填写(选其一填写)</div>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="form.phone" maxlength="11" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱地址"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="submit-box">
        <el-button type="info" @click="backToSubmit">返回</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as validator from '@/utils/validator'
import * as Invoice from '@/api/invoice.js'
import { toFixedNoRound } from '@/utils/validate.js'
import { invoiceMock } from './invoiceMock.js'


export default {
  name: 'invoice-issue',
  filters: {
    filtermoney (val) {
      return val.toFixed(2)
    }
  },
  data () {
    const validateElectronicPhone = (rule, telValue, callback) => {
      // 验证手机号码
      const phoneReg = /^1[0-9]{10}$/
      if (!phoneReg.test(telValue) && telValue !== '') {
        callback(new Error('输入的号码格式不正确'))
      }
      if (telValue === '' && this.form.email === '') {
        callback(new Error('联系电话和邮箱必填一个'))
      } else {
        callback()
      }
    }
    const validateElectronicEmail = (rule, mailValue, callback) => {
      // 验证邮箱地址
      const mailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      if (!mailReg.test(mailValue) && mailValue !== '') {
        callback(new Error('输入的邮箱格式不正确'))
      }
      if (mailValue === '' && this.form.phone === '') {
        callback(new Error('联系电话和邮箱必填一个'))
      } else {
        callback()
      }
    }
    const moneyRules = (rule, moneyValue, callback) => {
      const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(moneyValue)
      if (!moneyValue) callback(new Error('请输入开票金额'))
      if (!reg) {
        callback(new Error('请填写正确的金额'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        titleType: [{ required: true, message: '请选择抬头类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        taxNum: [{ required: true, validator: validator.taxNumValidator, messageNull: '请填写单位税号', messageError: '请填写正确单位税号', trigger: 'blur' }],
        money: [{ required: true, validator: moneyRules, trigger: 'blur' }],
        telephone: [{ validator: validator.telValidator, message: '请填写正确的手机号或固定电话', trigger: 'blur' }],
        phone: [{ validator: validateElectronicPhone, trigger: ['blur', 'change'] }],
        email: [{ validator: validateElectronicEmail, trigger: ['blur', 'change'] }]
      },
      orderSeachType: 'phone', // phone 顾客手机号 orderNum 订单号
      orderSearchValue: '',
      tableData: [],
      orderListLoading: false,
      form: {
        invoiceType: 'electronic', // 发票类型
        type: 'normal', // 普票
        titleType: '', // 抬头类型
        title: '', // 抬头
        taxNum: '', // 单位税号
        content: '', // 内容
        money: '', // 发票金额
        phone: '', // 收票信息-手机号
        email: '', // 收票信息－邮箱
        address: '', // 注册地址
        telephone: '', // 注册电话
        bankName: '', // 开户银行
        bankAccount: '' // 银行账号
      },
      pager: {
        page: 1,
        pageSize: 999,
        total: 100
      }
    }
  },
  computed: {
    // 选中订单
    checkOrder () {
      const filteCheckOrder = this.tableData.filter(item => item.isCheck && item.canCheck)
      return filteCheckOrder
    },
    // 最大金额
    maxInvoiceMoney () {
      const max = this.checkOrder.reduce(( acc, cur ) => acc + cur.canInvoiceMoney, 0)
      return max
    },
    // 最小金额
    minInvoiceMoney () {
      if (this.checkOrder.length > 1) {
        const createData = _.sortBy(this.checkOrder, (a) => a.canInvoiceMoney)
        return createData[0].canInvoiceMoney + 1
      }
      return 1
    }
  },
  methods: {
    /**
     * @description 搜索页面
     */
    async searchData () {
      try {
        this.orderListLoading = true
        await this.getCanInvoiceOrderList()
      } catch (error) {
        throw new Error(error)
      } finally {
        this.orderListLoading = false
      }
    },
    /**
     * @description 搜索
     */
    async getCanInvoiceOrderList () {
      if (!this.orderSearchValue) return this.$newMessage.warning('请输入相关信息')
      const req = {
        page: this.pager.page,
        pageSize: this.pager.pageSize,
        [this.orderSeachType]: this.orderSearchValue
      }
      const data = await Invoice.getCanInvoiceOrderList(req)
      this.tableData = data.list
    },
    /**
     * @description 开具
     */
    async submitForm () {
      try {
        this.$loading()
        await this.$refs.form.validate()
        const receiveInfo = ['phone', 'email']
        const otherInfo = ['address', 'telephone', 'bankName', 'bankAccount']
        const orderNums = this.checkOrder.map(item => item.orderNum)
        if (!orderNums.length) return this.$newMessage.warning('请选中单号')
        const req = { order_nums: orderNums }
        for (const key in this.form) {
          const value = this.form[key]
          if (!value) continue
          if (receiveInfo.includes(key)) {
            if (!req.receiveInfo) req.receiveInfo = {}
            req.receiveInfo[key] = value
          } else if (otherInfo.includes(key) && this.form.titleType === 'company') {
            if (!req.otherInfo) req.otherInfo = {}
            req.otherInfo[key] = value
          } else {
            if (key === 'money' && value < this.minInvoiceMoney) return this.$newMessage.warning('输入开票金额小于本次最小可开票金额')
            if (key === 'money' && value > this.maxInvoiceMoney) return this.$newMessage.warning('输入开票金额大于本次最大可开票金额')
            req[key] = value
          }
        }
        if (this.form.titleType === 'person') { delete req.taxNum }
        await Invoice.applyInvoice(req)
        this.$newMessage.success('开票成功')
        await this.getCanInvoiceOrderList()
        this.resetData()
      } catch (error) {
        if (typeof error === 'boolean') {
          console.error('开具失败' + error)
        } else {
          throw new Error(`开具失败${error}`)
        }
      } finally {
        this.$loadingClose()
      }
    },
    /**
     * @description 返回数据
     */
    backToSubmit () {
      this.$router.push('/finance-center/finance-index')
    },
    // 手机验证
    onInputPhone (type, len) {
      this.$nextTick(() => {
        if (this.form.receiveInfo[type].length > len) {
          this.form[type] = this.form.receiveInfo[type].substring(0, len)
        }
      })
      if (type === 'phone') { this.$refs.form.validateField('email') }
    },
    // 邮箱验证
    onInputEmail (type, len) {
      this.$refs.form.validateField('phone')
    },
    /**
     * @description 选中变化
     */
    onCheckChange () {
      this.form.money = ''
    },
    /**
     * @description 格式化金钱
     */
    stringMoney (row, column, cellValue, index) {
      const money = toFixedNoRound(cellValue)
      return `¥${money}`
    },
    /**
     * @description 清空数据
     */
    resetData () {
      this.$refs['form'].resetFields()
    },
    /**
     * @description 行样式
     */
    tableRowClassName ({ row, rowIndex }) {
      if (row.invoiceState === 'complete') {
        return 'disabled-row'
      }
      return ''
    },
    /**
     * @description 模拟输入
     */
    devInput () {
      this.form = JSON.parse(JSON.stringify(invoiceMock))
    }
  }
}
</script>

<style lang="less" scoped>
.invoice-issue {
  margin-top: 24px;

  .search-box {
    margin-bottom: 0;
    background-color: #fff;

    .input-with-select {
      & /deep/ .el-input__inner {
        width: 240px;
      }

      & /deep/ .el-input-group__prepend .el-input__inner {
        width: 120px;
      }
    }

    .button-box {
      margin-bottom: 20px;
    }

    .max-invoice-money {
      margin-left: auto;
      font-size: 12px;
      color: @red;
    }
  }

  .table-box {
    margin-top: 0;

    .table-header {
      padding-right: 16px;
    }

    .el-checkbox {
      margin-right: 16px;
    }

    /deep/ .el-checkbox__inner {
      border-radius: 50%;
    }
  }

  .issue-info-form {
    margin-top: 20px;

    .form-box {
      margin-top: 24px;

      .max-money-box {
        & /deep/ .el-form-item__content {
          display: flex;
        }

        .max-money {
          margin-left: 18px;
          font-size: 14px;
          font-weight: 400;
          color: @red;
        }
      }

      .el-input {
        width: 300px;
      }

      .panel-title {
        margin-bottom: 24px;
      }
    }
  }

  .submit-box {
    margin: 24px 0 50px;
    text-align: center;

    .el-button {
      width: 124px;
    }
  }
}
</style>

<style lang="less">
.el-table .disabled-row {
  background: #eee;
}
</style>
