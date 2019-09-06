import axios from '../../../axios'

/*
 * 产品管理
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/product/productnum',
    params: data
  })
}
// 获取所属供应商
export const getproductData = (data) => {
  return axios({
    url: 'material/supplier/getsuname',
    params: data
  })
}
// 新增
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: 'material/product/delete',
    params: data
  })
}
