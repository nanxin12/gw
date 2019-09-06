import axios from '../../../axios'

/*
 * 采购订单
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/ordertime',
    params: data
  })
}
// 根据采购单号id查对应数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/findid',
    params: data
  })
}
