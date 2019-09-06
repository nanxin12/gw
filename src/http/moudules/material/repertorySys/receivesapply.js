import axios from '../../../axios'

/*
 * 物资审批
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/approval',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/applic/alreadyup',
    data: data
  })
}
