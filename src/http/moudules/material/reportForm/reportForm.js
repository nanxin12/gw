import axios from '../../../axios'

/*
 * 报表所有数据
 */

// 盘点主页table数据
export const makeinv = (data) => {
  return axios({
    method: 'post',
    url: 'material/makeinv/form',
    params: data
  })
}
// 入库主页table数据
export const storage = (data) => {
  return axios({
    method: 'post',
    url: 'material/storage/all',
    params: data
  })
}
// 出库主页table数据
export const applic = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/form',
    params: data
  })
}
// 验收主页table数据
export const check = (data) => {
  return axios({
    method: 'post',
    url: 'material/check/all',
    params: data
  })
}
// 采购主页table数据
export const procurement = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/purchased',
    params: data
  })
}
