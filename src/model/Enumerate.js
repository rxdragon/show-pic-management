/**
 * @description 订单状态
 */
export const ORDER_STATE = {
  WAIT_PAIED: 'wait_paid',
  PAID: 'paid',
  COMPLETE: 'complete',
  CANCELLED: 'cancelled',
  CLOSED: 'closed'
}

// 订单转换中文
export const orderStateToCN = {
  [ORDER_STATE.WAIT_PAIED]: '待支付',
  [ORDER_STATE.PAID]: '已支付',
  [ORDER_STATE.COMPLETE]: '已完成',
  [ORDER_STATE.CANCELLED]: '已取消',
  [ORDER_STATE.CLOSED]: '已关闭'
}

/**
 * @description 流水状态【订单项状态】
 */
export const STREAM_STATE = {
  WAIT_UPLOAD: 'wait_upload',
  WAIT_RETOUCH: 'wait_retouch',
  RETOUCHING: 'retouching',
  COMPLETE: 'complete'
}

// 流水转中文
export const streamToCN = {
  [STREAM_STATE.WAIT_UPLOAD]: '待上传',
  [STREAM_STATE.WAIT_RETOUCH]: '待修图',
  [STREAM_STATE.RETOUCHING]: '修图中',
  [STREAM_STATE.COMPLETE]: '修图完成'
}

/**
 * @description 看片状态
 */
export const SECOND_RETOUCH_STATE = {
  WAIT_ADJUST: 'wait_adjust',
  ADJUSTING: 'adjusting',
  SATISFIED: 'satisfied',
  NO_NEED: 'no_need'
}

// 看片状态转换中文
export const secondRetouchStateToCN = {
  [SECOND_RETOUCH_STATE.WAIT_ADJUST]: '待调整',
  [SECOND_RETOUCH_STATE.ADJUSTING]: '在线看片中',
  [SECOND_RETOUCH_STATE.SATISFIED]: '已满意',
  [SECOND_RETOUCH_STATE.NO_NEED]: '无需看片'
}

/**
 * @description 订单来源
 */
export const ORDER_FROM = {
  USER: 'user',
  SHOW_PIC: 'show_pic',
  HIMO: 'himo'
}

export const OrderFromToCN = {
  [ORDER_FROM.USER]: '修修兽',
  [ORDER_FROM.SHOW_PIC]: '修修兽',
  [ORDER_FROM.HIMO]: '海马体'
}

/**
 * @description 订单来源
 */
export const USER_FROM = {
  SHOW_PIC: 'show_pic',
  HIMO: 'himo'
}

export const userFromToCN = {
  [ORDER_FROM.SHOW_PIC]: '修修兽',
  [ORDER_FROM.HIMO]: '海马体'
}

/**
 * @description 修图要求
 */
export const REQUIRE = {
  EYE: 1,
  FACE: 2,
  PIMPLES: 3,
  REFERENCE_IMG: 8
}

// 修图要求转中文
export const requireToCN = {
  [REQUIRE.EYE]: '眼睛增大幅度',
  [REQUIRE.FACE]: '瘦脸幅度',
  [REQUIRE.PIMPLES]: '祛痣',
  [REQUIRE.REFERENCE_IMG]: '参考图'
}

/**
 * @description 照片版本
 */
export const PHOTO_VERSION = {
  ORIGINAL_PATH: 'original_path',
  FINAL_PATH: 'final_path',
}

export const photoVersionToCN = {
  [PHOTO_VERSION.ORIGINAL_PATH]: '原片',
  [PHOTO_VERSION.FINAL_PATH]: '顾客满意照片',
}
