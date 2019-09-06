import axios from '../../../axios'

/*
 * 待采购
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/procurement/approved',
    params: data
  })
}
