import axios from '../../axios'
// 添加站点类型
export const addStationType = (params) => {
  return axios({
    method: 'post',
    url: 'product/stationType/addStationType',
    params
  })
}
// 查看站点类型列表
export const getStationType = () => {
  return axios({
    url: 'product/stationType/getStationType'
  })
}
// 修改站点类型列表
export const putStationType = (params) => {
  return axios({
    method: 'put',
    url: 'product/stationType/updateStationTypeById',
    params
  })
}
// 站点类型图片添加
export const addStationTypeImg = (data) => {
  return axios({
    headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime() },
    url: 'product/stationType/fileUpload',
    method: 'post',
    data
  })
}
// 删除站点类型列表
export const delStationType = (params) => {
  return axios({
    method: 'delete',
    url: 'product/stationType/delStationTypeById',
    params
  })
}
// 添加参数
export const addParameter = (params) => {
  return axios({
    method: 'post',
    url: 'product/alarmParam/addAlarmParam',
    params
  })
}
// 查看参数
export const getParameter = (params) => {
  return axios({
    url: 'product/alarmParam/getAlarmParam',
    params
  })
}
// 修改参数
export const putParameter = (data) => {
  return axios({
    method: 'put',
    url: 'product/alarmParam/updateAlarmParamById',
    data
  })
}
// 删除参数
export const delParameter = (params) => {
  return axios({
    method: 'delete',
    url: 'product/alarmParam/delAlarmParamById',
    params
  })
}
// 获取管网参数
export const getPipeData = () => {
  return axios({
    url: 'product/pipeNetwork/getPipeNetwork'
  })
}
// 添加管网
export const addPipeData = (data) => {
  return axios({
    method: 'post',
    url: 'product/pipeNetwork/addPipeNetwork',
    data
  })
}
// 删除管网
export const delPipeData = (params) => {
  return axios({
    url: 'product/pipeNetwork/delPipeNetwork',
    params
  })
}
// 分页查询站点
export const getStationPage = (params) => {
  return axios({
    url: 'product/station/getStationPage',
    params
  })
}
// 查询站点
export const getStationNoPage = (params) => {
  return axios({
    url: 'product/station/getStation',
    params
  })
}
// 删除站点
export const delStation = (params) => {
  return axios({
    method: 'delete',
    url: 'product/station/delStation',
    params
  })
}
// 添加站点
export const addStation = (data) => {
  return axios({
    method: 'post',
    url: 'product/station/addStation',
    data
  })
}
// 编辑站点
export const upStation = (data) => {
  return axios({
    method: 'put',
    url: 'product/station/updateStation',
    data
  })
}
// 分页查询RTU设备
export const getEquipmentPage = (params) => {
  return axios({
    url: 'product/rtuDevice/getRtuDevice',
    params
  })
}
// 添加RTU设备
export const addEquipment = (data, sensorTypes, pos) => {
  return axios({
    method: 'post',
    url: `product/rtuDevice/addRtuDevice?sensorTypes=${sensorTypes}&pos=${pos}`,
    data
  })
}
// 修改RTU设备
export const putEquipment = (data, sensorTypes) => {
  return axios({
    method: 'put',
    url: `product/rtuDevice/putRtuDeviceById?sensorTypes=${sensorTypes}`,
    data
  })
}
// 删除RTU设备
export const delEquipment = (params) => {
  return axios({
    method: 'delete',
    url: 'product/rtuDevice/delRtuDeviceById',
    params
  })
}
// 根据站点查询RTU设备
export const getEquipmentFormStation = (data) => {
  return axios({
    method: 'post',
    url: 'product/rtuDevice/getRtuDeviceByStationId',
    data
  })
}
// 获取实时数据
export const getNowData = () => {
  return axios({
    url: 'product/productData/getRealTimeData'
  })
}
// 分页获取实时数据
export const getNowDataPage = (params) => {
  return axios({
    url: 'product/productData/getRealTimeDataPage',
    params
  })
}
// 分页获取历史数据
export const getHistoryDataPage = (params) => {
  return axios({
    url: 'product/productData/getHistoryData',
    params
  })
}
// 查询实时报警
export const getRealTimeAlarmData = (params) => {
  return axios({
    url: 'product/alarm/getRealTimeAlarmData',
    params
  })
}
// 查询历史报警
export const getHistoryAlarmData = (params) => {
  return axios({
    url: 'product/alarm/getHistoryAlarmData',
    params
  })
}
// 根据设备监测类型查询对应的站点
export const getParameterStation = (params) => {
  return axios({
    url: 'product/station/getStationByTypeEnum',
    params
  })
}
// 获取摄像头列表
export const getCamerList = () => {
  return axios({
    url: 'hk/api/getCamerList'
  })
}
// 摄像头绑定站点
export const bindingStation = (data) => {
  return axios({
    method: 'post',
    url: 'hk/api/bindingStation',
    data
  })
}
// 删除摄像头
export const deleteCameraById = (params) => {
  return axios({
    method: 'DELETE',
    url: 'hk/api/deleteCameraById',
    params
  })
}
// 分页获取监控点资源
export const getMonitoringResources = (params) => {
  return axios({
    url: 'hk/api/getMonitoringResources',
    params
  })
}
// 手动抓图
export const manualGrab = (params) => {
  return axios({
    method: 'post',
    url: 'hk/api/manualGrab',
    params
  })
}
// 通过摄像头编码或时间获取摄像头图片
export const getCamerImageByCamerCode = (params) => {
  return axios({
    url: 'hk/api/getCamerImageByCamerCode',
    params
  })
}
// 通过摄像头编码获取站点编码
export const getCameraByCameraCode = (params) => {
  return axios({
    url: 'hk/api/getCameraByCameraCode',
    params
  })
}
// 开关阀
export const turnOnOrOff = (params) => {
  return axios({
    method: 'post',
    url: 'product/valve/valveManage',
    params
  })
}
