import axios from '../../axios'

/*
 * 用户列表
 */

// 获取组织架构树形列表
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
// 主页面用户list
export const list = (data) => {
  return axios({
    url: 'user/userInfo/list',
    params: data
  })
}
// 获取角色
export const getRoleListByUserId = (data) => {
  return axios({
    url: 'permission/roleController/getRoleListByUserId',
    params: data
  })
}
// 获取角色
export const assignRoles = (data) => {
  return axios({
    method: 'post',
    url: 'permission/roleController/assignRoles',
    params: data
  })
}
// 获取岗位信息
export const getPostTreeByUserIdAndRegionId = (data) => {
  return axios({
    url: 'permission/postController/getPostTreeByUserIdAndRegionId',
    params: data
  })
}
// 添加
export const save = (data) => {
  return axios({
    method: 'post',
    url: 'user/userInfo/system',
    data: data
  })
}
// findById
export const findById = (data) => {
  return axios({
    url: 'user/userInfo/get',
    params: data
  })
}
// 修改
export const upDate = (data) => {
  return axios({
    method: 'put',
    url: 'user/userInfo/put',
    data: data
  })
}
// 删除
export const deletes = (data) => {
  return axios({
    method: 'DELETE',
    url: 'user/userInfo',
    params: data
  })
}
// 修改密码
export const updatePassword = (data) => {
  return axios({
    url: 'user/userInfo/updatePassword',
    params: data
  })
}
// 分配岗位
export const assignPosts = (data) => {
  return axios({
    method: 'post',
    url: 'permission/roleController/assignPosts',
    params: data
  })
}
