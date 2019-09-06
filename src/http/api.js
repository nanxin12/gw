/*
 * 接口统一集成模块
 */
import * as wmanageht from './moudules/material/basicinfoSys/wmanageht'
import * as supplierht from './moudules/material/basicinfoSys/supplierht'
import * as classifymanageht from './moudules/material/basicinfoSys/classifymanageht'
import * as productmanageht from './moudules/material/basicinfoSys/productmanageht'
import * as plan from './moudules/material/purchasingSys/plan'
import * as applyApproval from './moudules/material/purchasingSys/applyApproval'
import * as applysub from './moudules/material/purchasingSys/applysub'
import * as checks from './moudules/material/repertorySys/checks'
import * as order from './moudules/material/purchasingSys/order'
import * as warehousing from './moudules/material/repertorySys/warehousing'
import * as receives from './moudules/material/repertorySys/receives'
import * as inventory from './moudules/material/repertorySys/inventory'
import * as deliverys from './moudules/material/repertorySys/deliverys'
import * as goodsIndex from './moudules/material/goodsIndex'
import * as receivesapply from './moudules/material/repertorySys/receivesapply'
import * as reportForm from './moudules/material/reportForm/reportForm'
import * as maintain from './moudules/maintain'
import * as userList from './moudules/system/userList' // 系统接口开始
import * as roleList from './moudules/system/roleList' // 系统接口
import * as menuList from './moudules/system/menuList' // 系统接口
import * as organizeList from './moudules/system/organizeList' // 系统接口
import * as url from './moudules/system/url' // 系统接口
import * as personalCenter from './moudules/system/personalCenter' // 系统接口
import * as home from './moudules/home'
import * as sso from './moudules/sso'
import * as product from './moudules/product'
import * as waterSupply from './moudules/waterSupply'
// 默认全部导出
export default {
  wmanageht, // 仓库
  supplierht, // 供应商
  classifymanageht, // 分类
  productmanageht, // 产品管理
  plan,
  applyApproval,
  applysub,
  checks,
  order,
  reportForm,
  warehousing,
  receives,
  inventory,
  deliverys,
  receivesapply,
  goodsIndex,
  maintain, // 运维接口
  userList, // 系统接口开始
  roleList, // 系统接口
  menuList, // 系统接口
  organizeList, // 系统接口
  url, // 系统接口
  personalCenter, // 系统接口
  sso, // 营收接口
  product, // 生产接口
  home,
  waterSupply // 大屏
}
