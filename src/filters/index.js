import { timeFormat, formatTime } from '@/utils/timeUtil.js'
import { photoVersionToCN, OrderFromToCN } from '@/model/Enumerate.js'

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toVersionCN (versionName) {
  return photoVersionToCN[versionName]
}
/**
 * @description 格式化金钱
 */
export function stringMoney (value) {
  const money = Number(value).toFixed(2)
  return `¥${money}`
}

/**
 * @description 装扮版本
 * @param {*} from 
 */
export function toOrderFromToCN (from) {
  return OrderFromToCN[from] || '异常'
}

/**
 * @description 更改名字
 * @param {*} value
 */
export function toLabelName (value) {
  switch (value) {
    case 'big':
      return '：大'
    case 'middle':
      return '：中'
    case 'small':
      return '：小'
    case 1:
    case '1':
      return ''
    case 'not_required':
      return '：不要求'
    default:
      return '：异常'
  }
}


/**
 * @description 时间更改
 * @param {*} time
 */
export function toTimeFormat (time) {
  return timeFormat(time)
}

/**
 * @description 时间转化中文
 * @param {*} time
 */
export function toTimeFormatText (time) {
  return timeFormat(time, 'text', true)
}

/**
 * @description 格式化时间
 * @param {*} time
 */
export function toTimeSpan (time) {
  return formatTime(time)
}
