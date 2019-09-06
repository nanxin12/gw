import Vue from 'vue'
import Router from 'vue-router'
import api from '@/http/api'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '主页',
      component: () => import('@/views/home')
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/views/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let userMsg = JSON.parse(localStorage.getItem('userMsg'))
  let pass = false
  if (userMsg) {
    if ((userMsg.time + 604800000) >= new Date().getTime()) {
      pass = true
      userMsg.time = new Date().getTime()
      localStorage.setItem('userMsg', JSON.stringify(userMsg))
    } else {
      localStorage.clear()
    }
  }
  if (to.path === '/login') {
    if (pass) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (!pass) {
      next({ path: '/login' })
    } else {
      /**
       * 加载动态菜单和路由
       */
      if (store.state.menuRouteLoaded) {
        next()
      } else {
        api.home.getPermissionByUserId({ userId: userMsg.id })
          .then(res => {
            if (res.code === 200) {
              // 添加动态路由
              let num = router.options.routes.length - 2
              router.options.routes.splice(1, num)
              if (!res.data.length) {
                Message.error('菜单数据为空')
                localStorage.clear()
                return Router.push('/login')
              }
              res.data.forEach(item => {
                let route = {
                  path: item.url,
                  component: null,
                  name: item.menuName,
                  children: []
                }
                route['component'] = () => import(`@/views${item.component}`)
                router.options.routes.push(route)
              })
              for (let i = 2; i < router.options.routes.length; i++) {
                router.options.routes[i].children = addDynamicRoutes(res.data[i - 2].children)
              }
              // 添加404页面路由
              router.options.routes.push(
                {
                  path: '*',
                  name: 'notFound',
                  component: () => import('@/components/NotFound')
                }
              )
              router.addRoutes(router.options.routes)
              // 保存加载状态
              store.commit('menuRouteLoaded', true)
              // 保存菜单树
              store.commit('setNavTree', res.data)
              next({ ...to, replace: true })
            } else {
              Message.error('菜单数据加载失败')
              localStorage.clear()
              next({ path: '/login' })
            }
          })
          .catch(res => {
            Message.error('菜单数据加载失败')
            localStorage.clear()
            next({ path: '/login' })
          })
      }
    }
  }
})

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function addDynamicRoutes (menuList = [], routes = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url) {
      // 创建路由配置
      let route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].menuName,
        meta: menuList[i].permission ? menuList[i].permission : []
      }
      route['component'] = () => import(`@/views${menuList[i].component}`)
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  }
  return routes
}

export default router
