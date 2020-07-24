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
  HIMO: 'himo',
  HIMO_KIDS: 'himo_kids'
}

export const OrderFromToCN = {
  [ORDER_FROM.USER]: '修修兽',
  [ORDER_FROM.SHOW_PIC]: '修修兽',
  [ORDER_FROM.HIMO]: '海马体',
  [ORDER_FROM.HIMO_KIDS]: '海马体儿童',
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
  CLOUD_FINISH_PATH: 'cloud_finish_path',
  FINAL_PATH: 'final_path',
}

export const photoVersionToCN = {
  [PHOTO_VERSION.ORIGINAL_PATH]: '原片',
  [PHOTO_VERSION.CLOUD_FINISH_PATH]: '云端成片',
  [PHOTO_VERSION.FINAL_PATH]: '顾客满意照片',
}

/**
 * @description 发票管理
 */
export const INVOICE_STATE = {
  MANUAL: 'manual',
  PENDING: 'pending',
  WAIT_WRITE: 'wait_write',
  COMPLETE: 'complete',
  FAIL: 'fail',
  INVALID: 'invalid',
}

export const invalidToCN = {
  [INVOICE_STATE.MANUAL]: '手动开具',
  [INVOICE_STATE.PENDING]: '开具中',
  [INVOICE_STATE.WAIT_WRITE]: '等待发票写入税盘',
  [INVOICE_STATE.COMPLETE]: '开具完成',
  [INVOICE_STATE.FAIL]: '开具失败',
  [INVOICE_STATE.INVALID]: '作废发票'
}

/**
 * @description 优惠券批次状态
 */
export const COUPON_BATCH_STATE = {
  NORMAL: 'normal',
  VOID: 'void'
}

export const couponBatchToCN = {
  [COUPON_BATCH_STATE.NORMAL]: '正常',
  [COUPON_BATCH_STATE.VOID]: '作废'
}

/**
 * @description 优惠券状态
 */
export const COUPON_STATE = {
  ACTIVATED: 'activated',
  UNUSED: 'unused',
  USED: 'used',
  ABOLISHED: 'abolished',
  EXPIRED: 'expired'
}

export const couponToCN = {
  [COUPON_STATE.ACTIVATED]: '未绑定',
  [COUPON_STATE.UNUSED]: '已绑定',
  [COUPON_STATE.USED]: '已使用',
  [COUPON_STATE.ABOLISHED]: '已作废',
  [COUPON_STATE.EXPIRED]: '已过期'
}

/**
 * @description 活动状态
 */
export const ACTIVITY_STATE = {
  WAITING: 'wait',
  STARTED: 'start',
  FINISHED: 'finish',
  END_EARLY: 'interrupt'
}

export const activityToCN = {
  [ACTIVITY_STATE.WAITING]: '未开始',
  [ACTIVITY_STATE.STARTED]: '进行中',
  [ACTIVITY_STATE.FINISHED]: '已结束',
  [ACTIVITY_STATE.END_EARLY]: '提前结束'
}

/**
 * @description 产品状态
 */
export const PRODUCT_STATE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  LINING: 'wait',
}

export const ProductStatusNameEnum = {
  [PRODUCT_STATE.ONLINE]: '已上线',
  [PRODUCT_STATE.OFFLINE]: '已下线',
  [PRODUCT_STATE.LINING]: '待上线'
}

/**
 * @description 修图标准id
 */
export const PS_ID = {
  ONE: 1,
  TWO: 2,
}

/**
 * @description 修图标准对应中文
 */
export const psTypeNameEnum = {
  'blue': '普通修图',
  'master': '大师修图'
}

/**
 * @description 修图对应id
 */
export const psTypeIdEnum = {
  'blue': 1,
  'master': 2
}

/**
 * @description id对应修图
 */
export const psIdTypeEnum = {
  [PS_ID.ONE]: 'blue',
  [PS_ID.TWO]: 'master'
}

/**
 * @description 产品库价格设置的状态 联系客服和正常设置
 */
export const PRODUCT_PRICE_STATUS = {
  CONTACT: 'contact', // 联系客服
  NORMAL: 'normal' // 正常设置
}

/**
 * @description 产品库产品是否需要后续sku设置
 */
export const PRODUCT_IS_SIMPLE = {
  SIMPLE: 'simple', // 不需要
  NOTSIMPLE: 'notSimple' // 需要
}
