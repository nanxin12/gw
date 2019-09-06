import axios from '../../axios'

/*
 * 组织
 */

// 获取主页数据
export const getPostTreeList = (data) => {
  return axios({
    url: 'permission/postController/getPostTreeList',
    params: data
  })
}
// 获取全国省
export const getProvince = (data) => {
  return axios({
    url: 'permission/regionController/getRegionTreeData',
    params: data
  })
}
// 通过地域父编码获取地域信息
export const getRegionByCode = (data) => {
  return axios({
    url: 'permission/regionController/getRegionByCode',
    params: data
  })
}
// 通过组织id获取组织信息
export const getPostById = (data) => {
  return axios({
    url: 'permission/postController/getPostById',
    params: data
  })
}
// 添加
export const insertPost = (data) => {
  return axios({
    method: 'post',
    url: 'permission/postController/insertPost',
    data: data
  })
}
// 删除
export const deletePostByIds = (data) => {
  return axios({
    method: 'DELETE',
    url: 'permission/postController/deletePostByIds',
    params: data
  })
}
// 修改
export const updatePost = (data) => {
  return axios({
    method: 'PUT',
    url: 'permission/postController/updatePost',
    data: data
  })
}
// 通过部门Id获取部门参数
export const getPostParameterByParameterId = (data) => {
  return axios({
    url: 'permission/postController/getPostParameterByParameterId',
    params: data
  })
}
// 部门参数添加
export const insertPostParameter = (data) => {
  return axios({
    method: 'post',
    url: 'permission/postController/insertPostParameter',
    data: data
  })
}
// 通过参数Id删除部门参数
export const deletePostParameterById = (data) => {
  return axios({
    method: 'delete',
    url: 'permission/postController/deletePostParameterById',
    params: data
  })
}
