import axios from '../../../axios'

/*
 * 供应商管理
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/supplier/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/supplier/suppliernum',
    params: data
  })
}
// 获取供应商分类
export const getSupplierData = (data) => {
  return axios({
    url: 'material/classific/classname',
    params: data
  })
}
// 新增
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'material/supplier/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/supplier/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/supplier/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: 'material/supplier/delete',
    params: data
  })
}
