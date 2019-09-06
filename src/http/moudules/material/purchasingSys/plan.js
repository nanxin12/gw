import axios from '../../../axios'

/*
 * 采购计划管理
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/procurement/procurementnum',
    params: data
  })
}
// 根据产品分类查产品名称
export const findByClassGetName = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/productname',
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
    url: 'material/procurement/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: '/material/procurement/delete',
    params: data
  })
}
