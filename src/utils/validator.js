/**
 * @description 自定义通用form表单验证
 * @author cf
/**
 * @description 判断字符串或数字为空，可以为0
 * @param {String, Number} value
 */
export function isBlank (value) {
  try {
    const _value = value.toString()
    return !_value
  } catch (error) {
    return true
  }
}

// 1位小数正数 正则
const SINGLE_DECIMAL_REG = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d{1})$/
const DOUBLE_DECIMAL_REG = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){0,2})?$/

function _validator (customValid, rule, value, callback) {
  if (rule.required && isBlank(value)) callback(new Error(rule.messageNull))
  else if (!rule.required && !value) callback()
  else if (!customValid) callback(new Error(rule.messageError))
  else callback()
}

/**
* @description 手机号码验证
*/
export const phoneValidator = (rule, value, callback) => {
  const reg = /^1[0-9]{10}$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 手机号码和固定电话验证
 */
export const telValidator = (rule, value, callback) => {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[0-9]{10}))$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
* @description 正数验证
*/
export const positiveValidator = (rule, value, callback) => {
  const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 正整数验证
 */
export const positiveIntValidator = (rule, value, callback) => {
  const reg = /^[1-9][0-9]*$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 优惠价格验证（一位小数）
 */
export const priceSingleValidator = (rule, value, callback) => {
  const reg = value <= 9999 && SINGLE_DECIMAL_REG.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 优惠价格验证（两位小数）
 */
export const priceDoubleValidator = (rule, value, callback) => {
  const reg = value <= 9999 && DOUBLE_DECIMAL_REG.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 折扣验证（一位小数）
 */
export const discountValidator = (rule, value, callback) => {
  const reg = value < 100 && SINGLE_DECIMAL_REG.test(value)
  _validator(reg, rule, value, callback)
}

/**
* @description 有理数验证（正负数）
*/
export const rationalNumValidator = (rule, value, callback) => {
  const reg = /^[+-]{0,1}(\d+)$|^[+-]{0,1}(\d+\.\d+)$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
* @description 纳税人识别号验证，仅限15、18、20位
*/
export const taxNumValidator = (rule, value, callback) => {
  const reg = /^\S{15}$|^\S{18}$|^\S{20}$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
* @description 邮箱验证
*/
export const emailValidator = (rule, value, callback) => {
  const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 字母数字空格验证
 */
export const englishValidator = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9\s]+$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 字母数字非空格验证
 */
export const englishNoSpaceValidator = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9]+$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description 数字非空格验证
 */
export const numberValidator = (rule, value, callback) => {
  const reg = /^[0-9]+$/.test(value)
  _validator(reg, rule, value, callback)
}

/**
 * @description http、https开头url验证（非严谨）
 */
export const urlValidator = (rule, value, callback) => {
  const reg = /^(http|https):\/\/([\w.]+\/?)\S*/.test(value)
  _validator(reg, rule, value, callback)
}
