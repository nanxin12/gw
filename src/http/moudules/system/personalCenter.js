import axios from '../../axios'

/*
 * 组织
 */

// 获取个人中心消息列表
export const getMessageList = (data) => {
  return axios({
    url: 'permission/PersonController/getMessageList',
    params: data
  })
}
// 获取消息未读总数
export const getMessageCount = (data) => {
  return axios({
    url: 'permission/PersonController/getMessageCount',
    params: data
  })
}
// 批量标记消息为已读状态
export const updateMessageByIds = (data) => {
  return axios({
    method: 'put',
    url: 'permission/PersonController/updateMessageByIds',
    params: data
  })
}
// 批量删除消息
export const deleteMessageByIds = (data) => {
  return axios({
    method: 'delete',
    url: 'permission/PersonController/deleteMessageByIds',
    params: data
  })
}
// 将消息全部标记已读
export const updateMessage = () => {
  return axios({
    method: 'post',
    url: 'permission/PersonController/updateMessage'
  })
}
// 批量删除已读消息
export const deleteMessage = () => {
  return axios({
    method: 'delete',
    url: 'permission/PersonController/deleteMessage'
  })
}
// 获取右边表格数据
export const getMessageBySingleAndStatusList = (data) => {
  return axios({
    params: data,
    url: 'permission/PersonController/getMessageBySingleAndStatusList'
  })
}
// 1物资 0采购
// 清除只清理已读的 清理显示所有的数量
