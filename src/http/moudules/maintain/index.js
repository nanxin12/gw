import axios from '../../axios'

// 站点上报
export const submits = (data) => {
  return axios({
    url: 'ops/event/saveEvent',
    method: 'post',
    data
  })
}
// 查询事件列表
export const getEventList = (params) => {
  return axios({
    url: 'ops/event/eventFindAll',
    params
  })
}
// 查询事件详情
export const getEventDetails = (data) => {
  return axios({
    url: `ops/event/findById/${data}`
  })
}
// 事件分派
export const eventOut = (data) => {
  return axios({
    url: 'ops/workSheet/saveWork',
    method: 'post',
    data
  })
}
// 事件删除
export const eventDel = (data) => {
  return axios({
    url: `ops/event/deleteEvent/${data}`,
    method: 'post'
  })
}
// 事件关闭
export const eventClose = (data) => {
  return axios({
    url: `ops/event/closeEvent/${data}`,
    method: 'post'
  })
}
// 根据事件id查询工单详情
export const eventToWork = (id) => {
  return axios({
    url: `ops/workSheet/findByEventId/${id}`
  })
}
// 修改事件状态
export const eventStatus = (id, params) => {
  return axios({
    url: `ops/event/changeStatus/${id}`,
    method: 'post',
    params
  })
}
// 事件批量删除
export const eventAllDel = (data) => {
  return axios({
    url: 'ops/event/deleteEventArray',
    method: 'post',
    data
  })
}
// 查询工单列表
export const getWorkList = (params) => {
  return axios({
    url: 'ops/workSheet/workFindAll',
    params
  })
}
// 查询工单总览
export const getPandectWorkList = (params) => {
  return axios({
    url: 'ops/workSheet/workViewAll',
    params
  })
}
// 工单上传图片
export const workUpload = (data) => {
  return axios({
    headers: { 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime() },
    url: 'ops/img/upload',
    method: 'post',
    data
  })
}
// 工单处理详情
export const getWorkDetails = (data) => {
  return axios({
    url: `ops/workSheet/workSheetInfo/${data}`,
    method: 'post'
  })
}
// 工单分派
export const workOut = (url, data) => {
  return axios({
    url: `ops/workSheet/workDist/${url}`,
    method: 'post',
    data
  })
}
// 工单保存
export const workSave = (data) => {
  return axios({
    url: 'ops/feedbackInfo/feedbackInfoSave',
    method: 'post',
    data
  })
}
// 工单处理
export const workHandle = (data) => {
  return axios({
    url: 'ops/feedbackInfo/feedbackInfoHandle',
    method: 'post',
    data
  })
}
// 工单关闭
export const workClose = (params) => {
  return axios({
    url: 'ops/workSheet/workClose',
    method: 'post',
    params
  })
}
// 查询计划制定列表
export const getPlanEnactList = (params) => {
  return axios({
    url: 'ops/patrolPlan/findPlanFraft',
    params
  })
}
// 添加或修改计划制定列表
export const addOrPutPlanEnactList = (data) => {
  return axios({
    url: 'ops/patrolPlan/savePlan',
    method: 'post',
    data
  })
}
// 提交计划
export const subPlan = (id) => {
  return axios({
    url: `ops/patrolPlan/submitPlan/${id}`,
    method: 'post'
  })
}
// 查询计划审批列表
export const getPlanRatifyList = (params) => {
  return axios({
    url: 'ops/patrolPlan/findPlanRatify',
    params
  })
}
// 计划审批
export const examinePlan = (data) => {
  return axios({
    url: 'ops/patrolPlan/approvalPlan',
    method: 'post',
    data
  })
}
// 根据部门ID查询用户列表
export const getUser = (data) => {
  return axios({
    url: `ops/event/findUserInfosByPostId/${data}`
  })
}
// 获取物资编号
export const getShopCode = (params) => {
  return axios({
    url: 'ops/event/applyNum',
    params
  })
}
// 添加物资
export const addShop = (data) => {
  return axios({
    method: 'post',
    url: 'ops/event/applyMaterial',
    data
  })
}
// 通过工单获取物资信息
export const getShopMsg = (data) => {
  return axios({
    url: `ops/workSheet/findMaterialsByWorkSheetId/${data}`
  })
}
// 获取巡检对象
export const getPlanObj = () => {
  return axios({
    url: 'ops/patrolPlan/patrolObjects'
  })
}
// 获取部门和用户
export const getUsers = () => {
  return axios({
    url: 'ops/patrolPlan/findPostUserInfo'
  })
}
// 批量删除巡检计划
export const delAllPlan = (data) => {
  return axios({
    method: 'delete',
    url: 'ops/patrolPlan/deletePlan',
    data
  })
}
// 获取计划分派列表
export const getPlanAss = (params) => {
  return axios({
    url: 'ops/planAssign/findAll',
    params
  })
}
// 任务分派
export const taskSend = (data) => {
  return axios({
    method: 'post',
    url: 'ops/planAssign/planAssign',
    data
  })
}
// 添加临时计划
export const addTemporaryPlan = (data) => {
  return axios({
    method: 'post',
    url: 'ops/planAssign/saveTemporaryPlan',
    data
  })
}
// 获取计划总览
export const getPlanPandect = (params) => {
  return axios({
    url: 'ops/patrolPlan/findPlanOverview',
    params
  })
}
// 获取分派总览
export const getAssignPandect = (params) => {
  return axios({
    url: 'ops/planAssign/findViewAll',
    params
  })
}
// 任务分派删除
export const delAssignPandect = (data) => {
  return axios({
    method: 'delete',
    url: 'ops/planAssign/deleteAssign',
    data
  })
}
// 获取计划详情
export const getPlanDetails = (id) => {
  return axios({
    url: `ops/patrolPlan/findById/${id}`
  })
}
// 添加巡检区域
export const addRegion = (data) => {
  return axios({
    method: 'post',
    url: 'ops/patrolArea/saveArea',
    data
  })
}
// 查询所有巡检区域带坐标
export const getRegionHas = () => {
  return axios({
    url: 'ops/patrolArea/findAll'
  })
}
// 删除区域
export const delRegion = (id) => {
  return axios({
    method: 'delete',
    url: `ops/patrolArea/deleteArea/${id}`
  })
}
// 查询巡检区域
export const getRegion = () => {
  return axios({
    url: 'ops/patrolArea/findIdName'
  })
}
// 获取巡检任务
export const getTask = (params) => {
  return axios({
    url: 'ops/patrolTask/findAll',
    params
  })
}
// 根据ID获取任务详情
export const getTaskById = (id) => {
  return axios({
    url: `ops/patrolTask/findById/${id}`
  })
}
// 删除巡检任务
export const delTaskById = (data) => {
  return axios({
    method: 'delete',
    url: 'ops/patrolTask/deleteTask',
    data
  })
}
// 查询事件站点统计
export const findEventSiteCensus = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/findEventSiteCensus',
    params
  })
}
// 查询事件数量统计和类型统计
export const findEventStatusOrCount = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/findEventStatusOrCount',
    params
  })
}
// 时长统计
export const sizeCensus = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/sizeCensus',
    params
  })
}
// 部门最近20天事件统计
export const statBy20day = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/statBy20day',
    params
  })
}
// 按用户分组查询用户上报数
export const statByPeople = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/statByPeople',
    params
  })
}
// 近一年事件数量统计
export const statInYear = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/statInYear',
    params
  })
}
// 查询事件年度统计
export const yearEventCensus = (params) => {
  return axios({
    url: 'ops/eventStatisticsController/yearEventCensus',
    params
  })
}
