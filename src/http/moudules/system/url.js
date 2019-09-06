import axios from '../../axios'

/*
 * 用户列表
 */

// 获取list
export const getBackendUrlList = (data) => {
  return axios({
    url: 'permission/backendUrlController/getBackendUrlList',
    params: data
  })
}
// 添加url
export const insertBackendUrl = (data) => {
  return axios({
    method: 'post',
    url: 'permission/backendUrlController/insertBackendUrl',
    data: data
  })
}
// 添加后台链接
export const insertParameter = (data) => {
  return axios({
    method: 'post',
    url: 'permission/ParameterController/insertParameter',
    data: data
  })
}
// 通过urlId 获取参数集合
export const getParameterListByUrl = (data) => {
  return axios({
    url: 'permission/ParameterController/getParameterListByUrl',
    params: data
  })
}
// 批量删除参数
export const deleteParameterById = (data) => {
  return axios({
    method: 'delete',
    url: 'permission/ParameterController/deleteParameterById',
    params: data
  })
}
// 删除url
export const deleteBackendUrl = (data) => {
  return axios({
    method: 'delete',
    url: 'permission/backendUrlController/deleteBackendUrl',
    params: data
  })
}
