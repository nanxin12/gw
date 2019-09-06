import axios from '../../../axios'

/*
 * 分类管理
 */

// 主页table数据
export const getList = (data) => {
  return axios({
    method: 'post',
    url: 'material/classific/all',
    params: data
  })
}
// 获取编号
export const getNum = (data) => {
  return axios({
    url: 'material/classific/classificnum',
    params: data
  })
}
// 新增
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'material/classific/add',
    data: data
  })
}
// 根据id查数据
export const findById = (data) => {
  return axios({
    method: 'post',
    url: 'material/classific/findid',
    params: data
  })
}
// 修改
export const update = (data) => {
  return axios({
    method: 'post',
    url: 'material/classific/update',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'post',
    url: 'material/classific/delete',
    params: data
  })
}
