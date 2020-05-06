import { isObj } from './index.js'
/**
 * @description 是否是外部链接
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL (url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail (email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString (str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description 是否是数字
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isNumber (arg) {
  return !isNaN(arg)
}

/**
 * @description 转换成数字
 * @param {*} arg
 */
export function toNumber (arg) {
  if (!isObj(arg)) {
    throw new Error('arg is not Object')
  }
  for (const key in arg) {
    if (isNumber(arg[key])) {
      arg[key] = Number(arg[key])
    }
  }
  return arg
}

/**
 * @description 是否是两位小数
 * @param {Array} value
 * @returns {Boolean}
 */
export function isTwoDecimals (value) {
  return Number.isInteger(value * 100)
}

/**
 * @description 等待时间
 * @param {*} time
 */
export function waitTime (time, passTime) {
  const nowTime = new Date().getTime()
  const valueTime = new Date(time).getTime()
  let passAtTime
  if (passTime) {
    passAtTime = new Date(passTime).getTime()
  }
  let differ = passTime ? (passAtTime - valueTime) : (nowTime - valueTime)
  differ = (differ / 1000 / 60).toFixed(0) + 'min'
  return differ
}
