<template>
  <div class="invoice-issue">
    <div class="order-select-module module-panel">
      <!-- 查询按钮 -->
      <div class="search-box">
        <div class="date-search search-item">
          <el-input v-model.trim="orderSearchValue" placeholder="请输入内容" class="input-with-select">
            <el-select slot="prepend" v-model="orderSeachType" placeholder="请选择">
              <el-option label="订单号" :value="1" />
              <el-option label="顾客姓名" :value="2" />
            </el-select>
          </el-input>
        </div>
        <div class="button-box">
          <el-button type="primary" size="small" @click="searchData">查 询</el-button>
        </div>
      </div>
      <!-- 订单列表 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="date" label="订单号" />
          <el-table-column prop="date" label="产品" />
          <el-table-column prop="date" label="可开票金额" />
          <el-table-column prop="date" label="开票状态" />
          <el-table-column prop="date" label="操控" align="right" width="100">
            <template slot="header" slot-scope="{ row }">
              <span class="table-header">操作</span><el-checkbox v-model="isAllCheck" :class="row" :indeterminate="hasSomeCheck"></el-checkbox>
            </template>
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.isCheck"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="issue-info-form module-panel">
      <div class="panel-title">发票信息填写</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="form-box" label-position="left">
        <el-form-item label="抬头类型" prop="titleType">
          <el-select v-model="form.titleType" placeholder="请选择抬头类型">
            <el-option label="个人" value="person"></el-option>
            <el-option label="单位" value="company"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="title">
          <el-input v-model="form.title" placeholder="请输入发票抬头"></el-input>
        </el-form-item>
        <el-form-item label="单位税号" prop="taxNum">
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
          <el-input v-model.trim="form.money" type="Number" v-numberOnly :max="maxInvoiceMoney" placeholder="请输入开票金额"></el-input>
          <div class="max-money">本次最大可开票金额：¥500.00</div>
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
</template>

<script>
import * as validator from '@/utils/validator'
export default {
  name: 'invoice-issue',
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
    return {
      rules: {
        titleType: [{ required: true, message: '请选择抬头类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入发票抬头', trigger: 'blur' }],
        taxNum: [{ required: true, validator: validator.taxNumValidator, messageNull: '请填写单位税号', messageError: '请填写正确单位税号', trigger: 'blur' }],
        money: [{ required: true, validator: validator.positiveValidator, messageNull: '请输入开票金额', messageError: '请填写正确的金额', trigger: 'blur' }],
        telephone: [{ validator: validator.telValidator, message: '请填写正确的手机号或固定电话', trigger: 'blur' }],
        phone: [{ validator: validateElectronicPhone, trigger: ['blur', 'change'] }],
        email: [{ validator: validateElectronicEmail, trigger: ['blur', 'change'] }]
      },
      orderSeachType: 1,
      orderSearchValue: '',
      tableData: [
        {
          date: 'asdas',
          isCheck: false
        },
        {
          date: 'dsadas',
          isCheck: false
        }
      ],
      form: {
        type: 'electronic', // 发票类型
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
      maxInvoiceMoney: 500 // 最大金额
    }
  },
  computed: {
    hasSomeCheck () {
      if (this.isAllCheck) return false
      return this.tableData.some(item => item.isCheck)
    },
    isAllCheck: {
      get () {
        return this.tableData.every(item => item.isCheck)
      },
      set () {
        const isAllCheck = this.isAllCheck
        this.tableData.forEach(item => item.isCheck = !isAllCheck)
      }
    }
  },
  methods: {
    searchData () {
      // TODO
    },
    /**
     * @description 开具
     */
    async submitForm () {
      try {
        await this.$refs.form.validate()
        const receiveInfo = ['phone', 'email']
        const otherInfo = ['address', 'telephone', 'bankName', 'bankAccount']
        const req = {}
        for (const key in this.form) {
          const value = this.form[key]
          if (!value) continue
          if (receiveInfo.includes(key)) {
            if (!req.receiveInfo) req.receiveInfo = {}
            req.receiveInfo[key] = value
          } else if (otherInfo.includes(key)) {
            if (!req.otherInfo) req.otherInfo = {}
            req.otherInfo[key] = value
          } else {
            if (key === 'money' && value > this.maxInvoiceMoney) return this.$newMessage.waring('输入开票金额大于本次最大可开票金额')
            req[key] = value
          }
        }
        // TODO 开票成功清除form数据
      } catch (error) {
        if (typeof error === 'boolean') {
          console.error('开具失败' + error)
        } else {
          throw new Error(`开具失败${error}`)
        }
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
      if (type === 'phone') {
        this.$refs.form.validateField('email')
      }
    },
    // 邮箱验证
    onInputEmail (type, len) {
      this.$refs.form.validateField('phone')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assetsDir/styles/variables.less';

.invoice-issue {
  margin-top: 24px;

  .search-box {
    margin-bottom: 0;

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
  }

  .table-box {
    margin-top: 0;

    .table-header {
      margin-right: 8px;
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
          color: rgba(230, 64, 73, 1);
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
