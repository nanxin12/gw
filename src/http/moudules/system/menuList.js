import axios from '../../axios'

/*
 * 用户列表
 */

// 获取list
export const getMenuList = (data) => {
  return axios({
    url: 'permission/menuController/getMenuList',
    params: data
  })
}
// 保存菜单
export const insertMenu = (data) => {
  return axios({
    method: 'post',
    url: 'permission/menuController/insertMenu?userId=1',
    data: data
  })
}
// 根据id获取菜单信息
export const getMenuById = (data) => {
  return axios({
    url: 'permission/menuController/getMenuById',
    params: data
  })
}
// 删除菜单
export const deleteMenuById = (data) => {
  return axios({
    method: 'DELETE',
    url: 'permission/menuController/deleteMenuById',
    params: data
  })
}
// 修改菜单
export const updateMenu = (data) => {
  return axios({
    method: 'put',
    url: 'permission/menuController/updateMenu',
    data: data
  })
}
// 添加后端菜单url
export const insertBackendUrl = (data) => {
  return axios({
    method: 'post',
    url: 'permission/backendUrlController/insertBackendUrl',
    data: data
  })
}
// 通过菜单Id获取后端菜单url
export const getBackendUrlListByMenuId = (data) => {
  return axios({
    url: 'permission/backendUrlController/getBackendUrlListByMenuId',
    params: data
  })
}
// 通过urlId 获取参数集合
export const getParameterListByUrl = (data) => {
  return axios({
    url: 'permission/ParameterController/getParameterListByUrl',
    params: data
  })
}
// 修改后端菜单url
export const updateBackendUrl = (data) => {
  return axios({
    method: 'put',
    url: 'permission/backendUrlController/updateBackendUrl',
    data: data
  })
}
// 删除url
export const deleteBackendUrl = (data) => {
  return axios({
    method: 'DELETE',
    url: 'permission/backendUrlController/deleteBackendUrl',
    params: data
  })
}
// 删除入参
export const deleteParameterById = (data) => {
  return axios({
    method: 'DELETE',
    url: 'permission/ParameterController/deleteParameterById',
    params: data
  })
}
