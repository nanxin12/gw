import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    digShow: false,
    menuRouteLoaded: false, // 菜单和路由是否已经加载
    navTree: [], // 导航菜单树
    axiosNum: 0, // 当前请求数量
    breadslist: [], // 面包屑数组
    showLod: false, // 加载动画
    isCollapse: false, // 是否折叠
    // CollapseWidth: { width: '220px!important' }, // 菜单宽度
    dp_alarm: [], // 大屏报警
    dp_bulletinBoard: [], // 大屏公告栏
    sc_monitor: [], // 生产监控
    sc_newImg: {}, // 生产监控,
    checkPath: null,
    facilityData: null
  },
  mutations: {
    // 改变菜单和路由的加载状态
    menuRouteLoaded (state, menuRouteLoaded) {
      state.menuRouteLoaded = menuRouteLoaded
    },
    // 设置导航菜单树
    setNavTree (state, navTree) {
      state.navTree = navTree
    },
    addAxiosNum (state) {
      state.axiosNum++
    },
    minusAxiosNum (state) {
      state.axiosNum--
    },
    changeDigShow (state, status) {
      state.digShow = status
    },
    addbreadslist (state, status) {
      state.breadslist.push(status)
    },
    deletebreadslist (state, status) {
      if (status === 'clear') {
        state.breadslist.splice(1)
      } else {
        state.breadslist.splice(status, 1)
      }
    },
    deleteall (state, status) {
      state.breadslist = status
    },
    checkloding (state, status) {
      state.showLod = status
    },
    checkisCollapse (state) {
      state.isCollapse = !state.isCollapse
      // if (state.isCollapse) state.CollapseWidth = { width: '61px!important' }
      // else state.CollapseWidth = { width: '220px!important' }
    },
    savePath (state, status) {
      state.checkPath = status
    },
    saveDpAlarm (state, status) {
      state.dp_alarm.push(status)
    },
    saveDpBulletinBoard (state, status) {
      state.dp_bulletinBoard.push(status)
    },
    saveNewImg (state, status) {
      state.sc_newImg = status
    },
    saveScMonitor (state, status) {
      state.sc_monitor.push(status)
    },
    savaFacilityData (state, data) {
      state.facilityData = data
    }
  },
  actions: {}
})
