const CommonException = [
  [0xA17000001, '请登录'],
  [0xA17000002, '配置未找到']
]

const InvoiceException = [
  [0xA17005001, '单次开票金额不可大于100000'],
  [0xA17005002, '检查订单异常'],
  [0xA17005003, '检查发票金额异常'],
  [0xA17005004, '发票未开具完成'],
  [0xA17005005, '非电子发票无法重新发送'],
  [0xA17005006, '发票结果不存在'],
  [0xA17005007, '发票不存在'],
  [0xA17005008, '非自身发票'],
]

const OrderException = [
  [0xA17001001, '非本人订单']
  [0xA17001002, '非待支付状态']
  [0xA17001003, '照片数据不能为空']
  [0xA17001004, '请检查订单价格']
  [0xA17001005, '非已付款状态，无法确认定订单']
]

const ProductException = [
  [0xA17003001, '产品规格不存在']
]

const StaffException = [
  [0xA17004001, '修改角色组同步权限失败']
  [0xA17004002, '伙伴未登录']
  [0xA17004003, '角色组创建失败']
  [0xA17004004, '账号创建失败']
  [0xA17004005, '角色组不存在']
]

export const errText = [
  ...CommonException,
  ...InvoiceException,
  ...OrderException,
  ...ProductException,
  ...StaffException
]
let errMap = new Map(errText)
export const errorCode = {
  getMsg: (err) => {
    let codeNum = Number(err.error_code)
    return errMap.get(codeNum) || JSON.stringify(err.error_msg)
  }
}