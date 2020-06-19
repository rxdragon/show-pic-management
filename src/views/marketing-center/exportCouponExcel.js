import { exportExcel } from '@/utils/exportExcelUtil.js'

export default function exportCouponExcel (couponTitle, data) {
  const excelName = couponTitle + '-券码'
  const headerCellName = ['券码编号', '状态', '绑定时间', '使用时间', '绑定账号', '使用订单号']
  const headerCellkeys = ['code', 'stateCN', 'bindAt', 'usedAt', 'userTel', 'userOrderNum']
  exportExcel(data, excelName, headerCellName, headerCellkeys)
}
