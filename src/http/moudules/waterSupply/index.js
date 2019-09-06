import axios from '../../axios'

/*
 * 大屏
 */

// 获取日总能耗、日总药耗
export const getDailyDrugConsumption = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/OverviewController/getDailyDrugConsumption'
  })
}
// 获取日供水量、产销差率
export const getDailyWaterSupply = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/OverviewController/getDailyWaterSupply'
  })
}
// 获取服务用户数、事件上报数
export const getServiceUsersAndEventReporting = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/OverviewController/getServiceUsersAndEventReporting'
  })
}
// 获取高位水池液位
export const getHightPollLc = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/ProductionMonitoringController/getHightPollLc'
  })
}
// 获取管线总长及当月新增管线总长
export const getPipeBNetwork = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/pipeNetwork/getPipeBNetwork'
  })
}
// 获取近6月售水量
export const getNearlyJuneWater = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getNearlyJuneWater'
  })
}
// 获取当天、当月用水量
export const getWaterDailyAndMonth = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/rawwaterMonitoring/getWaterDailyAndMonth'
  })
}
// 获取水泵个数、正常数、报警数
export const getWaterPumpTotal = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/rawwaterMonitoring/getWaterPumpTotal'
  })
}
// 获取设备总数、设备正常数、报警数、离线数
export const getEquipmentTotalAndNormalAndAbNormalAndOffLine = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/rawwaterMonitoring/getEquipmentTotalAndNormalAndAbNormalAndOffLine'
  })
}
// 获取不同类型站点个数、总站点数
export const getStationTypeCount = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getStationTypeCount'
  })
}
// 水质状态
export const getWaterQualityList = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getWaterQualityList'
  })
}
// 获取近七天用水量
export const getSevenDayWater = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getSevenDayWater'
  })
}
// 获取用户在线率、水费回收率、用户欠费率
export const getWaterRate = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getWaterRate'
  })
}
// 水表安装率
export const getWaterBinding = () => {
  return axios({
    // baseURL: 'http://192.168.1.189:10087',
    url: '/screen/SecondSupply/getWaterBinding'
  })
}
