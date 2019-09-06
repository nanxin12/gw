import axios from '../../../axios'

/*
 * 库存盘点
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/makeinv/all',
    params: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/makeinv/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/makeinv/update',
    data: data
  })
}
