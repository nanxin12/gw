import axios from '../../../axios'

/*
 * 物资出库
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/outall',
    params: data
  })
}
// 确认出库
export const outSure = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/firmout',
    data
  })
}
