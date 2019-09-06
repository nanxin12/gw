import axios from '../../../axios'

/*
 * 物资申请
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/all',
    params: data
  })
}
// 提交数据
export const Submis = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/submis',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/applic/applicnum',
    params: data
  })
}
// 获取所有产品名称
export const getProductName = (data) => {
  return axios({
    url: 'material/product/name',
    params: data
  })
}
// 获取所有验收单号
export const getCheckNum = (data) => {
  return axios({
    url: 'material/check/getnums',
    params: data
  })
}
// 获取所有仓库名称
export const getWarehouse = (data) => {
  return axios({
    url: 'material/warehouse/wrname',
    params: data
  })
}
// 新增
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/add',
    data: data
  })
}
// 手动提交
export const manualSave = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/abnormal',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: '/material/applic/delete',
    params: data
  })
}
