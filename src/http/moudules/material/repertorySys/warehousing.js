import axios from '../../../axios'

/*
 * 入库管理
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/storage/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/storage/storagenum',
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
    url: 'material/storage/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/storage/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/storage/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: '/material/storage/delete',
    params: data
  })
}
// 获取申请单号列表
export const findApplicatNums = () => {
  return axios({
    url: '/material/applic/findApplicatNums'
  })
}
// 根据申请单号查对应信息
export const findByNums = (data) => {
  return axios({
    url: '/material/applic/findByNums',
    params: data
  })
}
