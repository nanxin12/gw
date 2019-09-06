import axios from '../../axios'

/*
 * 用户列表
 */

// 获取list
export const getList = (data) => {
  return axios({
    url: '/material/home/data',
    params: data
  })
}
