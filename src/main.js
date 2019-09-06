import Vue from 'vue'
import App from '@/App.vue'
import '@/assets/css/public.css'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from '@/http/index'
import router from '@/router'
import store from '@/store'
import Print from '@/assets/js/print'
import '@/assets/icon/iconfont.css'
import Fragment from 'vue-fragment'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')

// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
// 图例翻译滚动
require('echarts/lib/component/legendScroll')
Vue.filter('money', function (value) {
  if (!value) return '暂无数据'
  return value.toFixed(2)
})
Vue.directive('has', {
  bind: function (el, binding, vnode) {
    // 获取页面按钮权限
    let num = false
    let meta = vnode.context.$route.meta
    meta.forEach(item => {
      if (item === binding.value.type) {
        num = true
      }
    })
    if (!num) {
      el.style.display = 'none'
    }
  }
})
Vue.prototype.$swiper = Swiper
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(Fragment.Plugin)
Vue.use(Print)
Vue.use(api)
Vue.use(ElementUi)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
