/**
 * @property {Number} streamId - 流水id
 * @property {String} updated_at -更新时间
 */

const sexToCN = {
  male: '男',
  female: '女'
}

export default class UserModel {
  base = {}
  id = 0 // 用户id
  from = '' // 来源
  name = '-' // 姓名
  wxname = '' // 账号
  sex = '' // 性别
  phone = '' // 手机号
  createdAt = '' // 创建时间
  consumeTotal = 0 // 下单金额
  userConsumeNum = 0 // 下单次数
  recentlyConsume = '' // 最近消费时间

  constructor (userData) {
    this.base = userData
    this.id = userData.id || 0
    this.from = userData.source || '-'
    this.name = userData.name || '-'
    this.wxname = userData.wxname || '-'
    this.sex = sexToCN[userData.sex] || '-'
    this.phone = userData.phone
    this.createdAt = userData.created_at || '-'
    this.consumeTotal = Number(userData.consume_total)
    this.userConsumeNum = Number(userData.consume_num)
    this.recentlyConsume = userData.last_buy_time || '-'
  }
}
