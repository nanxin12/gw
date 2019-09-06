import axios from 'axios'
import config from './config'
import store from '../store'
import { Message } from 'element-ui'

export default function $axios (options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout
      // withCredentials: config.withCredentials
    })
    // request 拦截器
    instance.interceptors.request.use(
      config => {
        if (localStorage.getItem('userMsg')) {
          let userMsg = JSON.parse(localStorage.getItem('userMsg'))
          // config.url = `${config.url}?userId=${userMsg.id}&token=${userMsg.token}`
          config.headers.userId = userMsg.id
          config.headers.token = userMsg.token
        }
        // 1. 请求开始的时候可以结合 vuex 开启全屏 loading 动画
        if (!store.state.showLod) store.commit('checkloding', true)
        store.commit('addAxiosNum')
        return config
      }
    )

    // response 拦截器
    instance.interceptors.response.use(
      response => {
        store.commit('minusAxiosNum')
        let data
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
        if (response.data === undefined) {
          data = JSON.parse(response.request.responseText)
        } else {
          data = response.data
        }
        if (Object.is(store.state.axiosNum, 0)) store.commit('checkloding', false)
        return data
      },
      err => {
        store.commit('minusAxiosNum')
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错误'
              break
            case 401:
              err.message = '权限不足'
              break
            case 403:
              err.message = '拒绝访问'
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时'
              break
            case 500:
              err.message = '服务器内部错误'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误'
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '网关超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
              break
          }
        }
        if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
          err.message = '请求超时'
        }
        if (Object.is(store.state.axiosNum, 0)) store.commit('checkloding', false)
        if (err.response) {
          if (err.response.status === 401) Message.error(err.message)
          else Message.error(err.response.data.msg)
          return Promise.reject(err.response.data) // 返回接口返回的错误信息
        } else {
          Message.error(err.message)
          return Promise.reject(err) // 返回接口返回的错误信息
        }
      }
    )

    // 请求处理
    instance(options).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
