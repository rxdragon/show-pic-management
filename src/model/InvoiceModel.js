// 发票管理

import { invalidToCN } from '@/model/Enumerate.js'

const changeMap = {
  person: '个人',
  company: '单位'
}

export default class InvoiceModel {
  base = {}
  id = '' // 发票id
  orderID = '' // 订单号
  state = '' // 发票状态
  stateToCN = '' // 发票中文
  invoicedate = '' // 开票时间
  price = '' // 开票金额
  invoiceTitle = '' // 发票抬头
  titleType = '' // 抬头类型
  titleTypeCN = '' // 抬头类型中文
  proposerAccount = '' // 申请人账号
  address = '-' // 注册地址
  telephone = '' // 注册电话
  bankName = '' // 开户银行
  bankaccount = '' // 银行账号
  ticketPhone = '' // 收票手机
  ticketEmail = '' // 收票邮箱
  electronicInvoice = '' // 电子发票
  invoiceInfo = {} // 发票信息
  ticketInfo = {} // 收票信息
  taxnum = '' // 税号


  constructor (invoiceData) {
    this.base = invoiceData
    this.id = invoiceData.id
    this.orderID = invoiceData.order_id
    this.state = invoiceData.status || '-'
    this.stateToCN = invalidToCN[this.state]
    this.invoicedate = invoiceData.created_at || '-'
    this.price = _.get(invoiceData, 'info.detail[0].price') || 0
    this.price = Number(this.price)
    this.invoiceTitle = invoiceData.name || '-'
    this.titleType = _.get(invoiceData, 'info.extend.title_type') || '-'
    this.titleTypeCN = changeMap[this.titleType]
    this.proposerAccount = _.get(invoiceData, 'userInfo.phone') || '-'
    this.address = _.get(invoiceData, 'info.address') || '-'
    this.telephone = _.get(invoiceData, 'info.telephone') || '-'
    this.taxnum = invoiceData.taxnum || '-'
    const saleaccount = _.get(invoiceData, 'info.account') || '- -'
    this.bankName = saleaccount.split(' ')[0]
    this.bankaccount = saleaccount.split(' ')[1]
    this.ticketPhone = _.get(invoiceData, 'info.phone') || ''
    this.ticketEmail = _.get(invoiceData, 'info.email') || ''
    this.electronicInvoice = _.get(invoiceData, 'info.result.pdf_url') || ''
    this.getInvoiceInfo()
    this.getTicketInfo()
  }

  // 获取发票信息
  getInvoiceInfo () {
    this.invoiceInfo = [
      {
        label: '发票类型：',
        value: '电子普通发票'
      },
      {
        label: '抬头类型：',
        value: changeMap[this.titleType] || '异常'
      },
      {
        label: '发票抬头：',
        value: this.invoiceTitle
      },
      {
        label: '注册地址：',
        value: this.address
      },

      {
        label: '开户银行：',
        value: this.bankName
      },
      {
        label: '发票金额：',
        value: `¥${this.price.toFixed(2)}`
      },
      {
        label: '单位税号：',
        value: this.taxnum
      },
      {
        label: '注册电话：',
        value: this.telephone
      },
      {
        label: '银行账号：',
        value: this.bankaccount
      },
    ]
  }

  // 获取取票信息
  getTicketInfo () {
    this.ticketInfo = [
      {
        label: '手机号：',
        value: this.ticketPhone
      },
      {
        label: '邮箱：',
        value: this.ticketEmail
      }
    ]
  }
}
