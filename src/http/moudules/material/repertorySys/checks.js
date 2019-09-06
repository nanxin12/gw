import axios from '../../../axios'

/*
 * 物资验收
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/check/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/check/checknum',
    params: data
  })
}
// 获取所有采购单号
export const getChaseNum = (data) => {
  return axios({
    url: 'material/procurement/order',
    params: data
  })
}
// 新增
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'material/check/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/check/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/check/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: '/material/check/delete',
    params: data
  })
}
