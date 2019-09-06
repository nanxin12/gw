import axios from '../../../axios'

/*
 * 采购计划审批
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/filter',
    params: data
  })
}
