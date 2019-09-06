import axios from '../../axios'

// 查询用户
export const getUserList = (params) => {
  return axios({
    url: 'revenue/frontUser/findAllUser',
    params
  })
}
// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'revenue/frontUser/addFrontUser',
    method: 'post',
    data
  })
}
// 批量添加用户
export const upAddUsers = (data) => {
  return axios({
    url: 'revenue/frontUser/importExcelFrontUer',
    headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime() },
    method: 'post',
    data
  })
}
// 下载用户信息模板
export const userDownload = () => {
  return axios({
    url: 'revenue/frontUser/exportExcelFrontUser',
    responseType: 'blob'
  })
}
// 查询未绑定水表
export const getNotBoundWaterMeter = () => {
  return axios({
    url: 'revenue/waterMeter/getWaterMeterNotband'
  })
}
// 添加水表
export const addWaterMeter = (data) => {
  return axios({
    method: 'post',
    url: 'revenue/waterMeter/addWaterMeter',
    data
  })
}
// 更换水表
export const changeMeter = (params) => {
  return axios({
    method: 'put',
    url: 'revenue/frontUser/updateUserMeter',
    params
  })
}
// 修改用户
export const putUser = (data) => {
  return axios({
    method: 'put',
    url: 'revenue/frontUser/updateFrontUserById',
    data
  })
}
// 注销用户
export const delUser = (params) => {
  return axios({
    method: 'put',
    url: 'revenue/frontUser/updateUserStatus',
    params
  })
}
// 账单查询
export const getBill = (params) => {
  return axios({
    url: 'revenue/bill/findAllBill',
    params
  })
}
// 账单导出
export const downloadBill = () => {
  return axios({
    url: 'revenue/bill/exportExcelBill',
    responseType: 'blob'
  })
}
// 缴费明细查询
export const getPayDetail = (params) => {
  return axios({
    url: 'revenue/payRecord/findAllPayRecord',
    params
  })
}
// 欠费用户查询
export const getArrearageUser = (params) => {
  return axios({
    url: 'revenue/frontUser/findArrearageUser',
    params
  })
}
// 查询水表列表
export const getMeterList = (params) => {
  return axios({
    url: 'revenue/waterMeter/findAllWaterMeter',
    params
  })
}
// 修改水表
export const putMeter = (data) => {
  return axios({
    method: 'put',
    url: 'revenue/waterMeter/updateWaterMeter',
    data
  })
}
// 删除水表
export const delMeter = (params) => {
  return axios({
    method: 'delete',
    url: 'revenue/waterMeter/deleteWaterMeter',
    params
  })
}
// 水表模板下载
export const meterDownload = () => {
  return axios({
    url: 'revenue/waterMeter/exportExcelWaterMeter',
    responseType: 'blob'
  })
}
// 批量上传水表
export const meterUp = (data) => {
  return axios({
    url: 'revenue/waterMeter/importExcelWaterMeter',
    headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime() },
    method: 'post',
    data
  })
}
// 水表实时数据
export const getNowData = (params) => {
  return axios({
    url: 'revenue/message/businessPayMoney',
    params
  })
}
// 手表历史数据
export const getHistroyData = (params) => {
  return axios({
    url: 'revenue/hisMessage/findAllHisMessage',
    params
  })
}
// 关闭阀门
export const closeValve = (params) => {
  return axios({
    url: 'revenue/message/batchCloseValve',
    params
  })
}
// 关闭阀门
export const openValve = (params) => {
  return axios({
    url: 'revenue/message/batchOpenValve',
    params
  })
}
// 抄表模板下载
export const readMeterDownload = () => {
  return axios({
    url: 'revenue/handMessage/exportExcelHM',
    responseType: 'blob'
  })
}
// 手抄表批量上传
export const readMeterUp = (data) => {
  return axios({
    url: 'revenue/handMessage/importExcelHM',
    headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime() },
    method: 'post',
    data
  })
}
// 抄表管理展示
export const readMeter = (params) => {
  return axios({
    url: 'revenue/handMessage/findAllWaterMeter',
    params
  })
}
// 添加手抄表数据
export const addReadMeter = (params) => {
  return axios({
    method: 'post',
    url: 'revenue/handMessage/addHandMessage',
    params
  })
}
// 抄表历史展示
export const readHistoryMeter = (params) => {
  return axios({
    url: 'revenue/handMessage/findAllHandMessage',
    params
  })
}
// 获取水价列表
export const getWaterPrice = () => {
  return axios({
    url: 'revenue/waterPrice/findAllWaterPrice'
  })
}
// 添加水价
export const addWaterPrice = (data) => {
  return axios({
    method: 'post',
    url: 'revenue/waterPrice/addWaterPrice',
    data
  })
}
// 添加水价
export const putWaterPrice = (data) => {
  return axios({
    method: 'put',
    url: 'revenue/waterPrice/updateWaterPrice',
    data
  })
}
// 添加水价
export const delWaterPrice = (params) => {
  return axios({
    method: 'delete',
    url: 'revenue/waterPrice/delWaterPrice',
    params
  })
}
// 查询参数信息
export const getSetingMsg = () => {
  return axios({
    url: 'revenue/argument/findAllArgument'
  })
}
// 修改参数信息
export const putSetingMsg = (data) => {
  return axios({
    method: 'put',
    url: 'revenue/argument/updateArgument',
    data
  })
}
// 打印发票参数信息
export const getInvoiceSetingMsg = (params) => {
  return axios({
    url: 'revenue/argument/printSysParams',
    params
  })
}
// 获取首页标题数据
export const getIndexTitData = () => {
  return axios({
    url: 'revenue/survey/getStatisticsList'
  })
}
// 获取首页图表数据
export const getIndexChartsData = () => {
  return axios({
    url: 'revenue/survey/getColumnList'
  })
}
// 短信催收欠费用户
export const sendMessageArrearage = (params) => {
  return axios({
    url: 'revenue/frontUser/waterFeeCollection',
    params
  })
}
// 营业厅缴费
export const payWater = (params) => {
  return axios({
    url: 'revenue/pay/businessPayMoney',
    method: 'post',
    params
  })
}
// 获取用户异常用水信息
export const getfAbnormalUserList = (params) => {
  return axios({
    url: 'revenue/abnormal/findAllAbnormal',
    params
  })
}
// 获取数据统计图表数据
export const getDataPageMsg = (params) => {
  return axios({
    url: 'revenue/survey/getAnalysisList',
    params
  })
}
