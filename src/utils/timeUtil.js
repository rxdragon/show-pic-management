import moment from 'moment'
import { isArray } from '@/utils/validate.js'

/**
 * @description 时间格式化
 * @param {*} params
 */
export function timeFormat (seconds, type, showZero = false) {
  const isShowText = type === 'text'
  const isEnText = type === 'en'
  // 计算
  let i = 0
  let s = parseInt(seconds)
  if (s > 60) {
    i = parseInt(s / 60)
    s = parseInt(s % 60)
  }
  // 补零
  const zero = function (v) {
    if (showZero) {
      return (v >> 0) < 10 ? '0' + v : v
    } else {
      return v
    }
  }
  if (isEnText) {
    return zero(i) + 'min' + zero(s) + 'sec'
  }
  if (isShowText) {
    return zero(i) + '分' + zero(s) + '秒'
  } else {
    return zero(i) + ':' + zero(s)
  }
}

/**
 * @description 拼接时间参数处理
 * @param {*} time
 * @param {*} addDay
 */
export function joinTimeSpan (time, addDay) {
  const date = moment(time)
  if (addDay) {
    date.add(1, 'day')
  }

  return date.format('YYYY-MM-DD 08:00:00')
}

/**
 * @description 开始
 * @param {*} time 
 */
export function startDayTime (time) {
  const date = moment(time)
  return date.format('YYYY-MM-DD 00:00:00')
}

/**
 * @description 结束时间
 * @param {*} time 
 */
export function endDayTime (time) {
  const date = moment(time)
  return date.format('YYYY-MM-DD 23:59:59')
}

/**
 * @description 获取搜索时间
 * @param {*} timeSpan 
 */
export function getSeachTime (timeSpan) {
  if (!timeSpan || !isArray(timeSpan) || timeSpan.length !== 2) {
    throw new Error('输入时间异常')
  }
  return [startDayTime(timeSpan[0]), endDayTime(timeSpan[1])]
}

export function revertTimeSpan (time, subtractDay) {
  const date = moment(time)
  if (subtractDay) {
    date.subtract(1, 'days')
  }
  return date.format('YYYY-MM-DD')
}

/**
 * @description 格式化时间
 * @param {*} time
 */
export function formatTime (time) {
  if (time === '-' || !time) return '-'
  const date = moment(time)
  return date.format('YYYY.MM.DD HH:mm')
}

export function getNowDate () {
  const date = moment(new Date())
  return date.format('YYYY-MM-DD')
}

