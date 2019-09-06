import axios from '../../axios'

/*
 * 用户列表
 */

// 获取list
export const getRoleList = (data) => {
  return axios({
    url: 'permission/roleController/getRoleList',
    params: data
  })
}
// 添加角色信息
export const insertRole = (data) => {
  return axios({
    method: 'POST',
    url: 'permission/roleController/insertRole',
    data: data
  })
}
// 删除角色信息
export const deleteRoleByIds = (data) => {
  return axios({
    method: 'DELETE',
    url: 'permission/roleController/deleteRoleByIds',
    params: data
  })
}
// 获取菜单树
export const getMenuTree = (data) => {
  return axios({
    url: 'permission/menuController/getMenuTree',
    params: data
  })
}
// 保存菜单树
export const authorizePermission = (data) => {
  return axios({
    method: 'post',
    url: 'permission/roleController/authorizePermission',
    params: data
  })
}
// 通过角色Id获取角色信息
export const getRoleById = (data) => {
  return axios({
    url: 'permission/roleController/getRoleById',
    params: data
  })
}
// 修改
export const updateRole = (data) => {
  return axios({
    method: 'post',
    url: 'permission/roleController/updateRole',
    data: data
  })
}
