import axios from '../../axios'
// 通过用户id 获取权限信息
export const getPermissionByUserId = (params) => {
  return axios({
    url: 'permission/roleController/getPermissionByUserId',
    params
  })
}
// 通过用户id 获取权限信息
export const login = (params) => {
  return axios({
    url: 'user/userInfo/systemLogin',
    params
  })
}
// 验证码
export const verifyCode = (data) => {
  return axios({
    url: 'user/userInfo/verifyCode',
    params: data
  })
}
// 登出
export const loginOut = () => {
  return axios({
    url: 'user/userInfo/logout'
  })
}
