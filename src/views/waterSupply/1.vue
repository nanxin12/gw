<template>
  <div class="wscBox">
    <div class="noneBox"></div>
    <div class="content">
      <div class="leftBox">
        <div class="leftTop">
          <div class="topLeft">
            <div class="topOne">
              <ul>
                <li>
                  <div class="box">
                    <img src="../../assets/img/dp_rgs.png"
                      alt="">
                    <div>
                      <p class="p">日供水总量</p>
                      <p>{{this.consumptionData.dailyWaterSupply}}</p>
                    </div>
                  </div>
                  <div class="box">
                    <img src="../../assets/img/dp_hu.png"
                      alt="">
                    <div>
                      <p class="p">服务用户数</p>
                      <p>{{this.consumptionData.serviceUsersCount}}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <img src="../../assets/img/dp_cx.png"
                      alt="">
                    <div>
                      <p class="p">产销差率</p>
                      <p>{{this.consumptionData.rateSale}}</p>
                    </div>
                  </div>
                  <div class="box">
                    <img src="../../assets/img/dp_sj.png"
                      alt="">
                    <div>
                      <p class="p">事件上报数</p>
                      <p>{{this.consumptionData.eventReport}}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <img src="../../assets/img/dp_nh.png"
                      alt="">
                    <div>
                      <p class="p">日总能耗</p>
                      <p>{{this.consumptionData.dailyEnergyConsumption}}</p>
                    </div>
                  </div>
                  <div class="box">
                    <img src="../../assets/img/dp_yh.png"
                      alt="">
                    <div>
                      <p class="p">日总药耗</p>
                      <p>{{this.consumptionData.dailyDrug}}</p>
                    </div>
                  </div>
                </li>
                <!-- <li>
                  <img src="../../assets/img/dp_rgs.png"
                    alt="">
                  <div>
                    <p class="p">日供水总量</p>
                    <p>{{this.consumptionData.dailyWaterSupply}}</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/dp_hu.png"
                    alt="">
                  <div>
                    <p class="p">服务用户数</p>
                    <p>{{this.consumptionData.serviceUsersCount}}</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/dp_cx.png"
                    alt="">
                  <div>
                    <p class="p">产销差率</p>
                    <p>{{this.consumptionData.rateSale}}</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/dp_sj.png"
                    alt="">
                  <div>
                    <p class="p">事件上报数</p>
                    <p>{{this.consumptionData.eventReport}}</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/dp_nh.png"
                    alt="">
                  <div>
                    <p class="p">日总能耗</p>
                    <p>{{this.consumptionData.dailyEnergyConsumption}}</p>
                  </div>
                </li>
                <li>
                  <img src="../../assets/img/dp_yh.png"
                    alt="">
                  <div>
                    <p class="p">日总药耗</p>
                    <p>{{this.consumptionData.dailyDrug}}</p>
                  </div>
                </li> -->
              </ul>
              <borderImg></borderImg>
            </div>
            <div class="topTwo">
              <div class="title">公告栏</div>
              <borderImg></borderImg>
              <div style="color:white;font-size:20px;text-align:center"
                v-if="bulletinBoard.length == 0">暂无数据</div>
              <div class="ulBox"
                ref="ulFatherBox"
                @mouseenter="stopTime"
                @mouseleave="initpao">
                <ul ref="ulBox">
                  <li v-for="(item, index) in bulletinBoard"
                    :key="index">
                    <div class="liBox">
                      <div class="liBoxOne">
                        <span v-if="item.messageType==='HK_PICTURE'">
                          <span v-for="(v, index) in stationLists"
                            :key="index"
                            v-show="v.id === item.data.stationCode">{{v.location + v.name + '警戒区域报警'}}</span>
                        </span>
                        <span v-if="item.messageType==='EVENT'">{{item.data.content}}</span>
                        <span v-if="item.messageType==='ALARM'">
                          <span v-for="(v, index) in alarmType"
                            :key="index"
                            v-show="item.data.type === v.name">{{item.data.location + item.data.stationName + v.val + '报警'}}</span>
                        </span>
                      </div>
                      <div class="liBoxTwo">
                        <span v-if="item.messageType==='EVENT'">{{item.data.addr}}</span>
                        <span v-if="item.messageType==='ALARM'">{{item.data.location}}</span>
                        <span v-if="item.messageType==='HK_PICTURE'">
                          <span v-for="(v, index) in stationLists"
                            :key="index"
                            v-show="v.id === item.data.stationCode">{{v.location}}</span>
                        </span>
                        <span v-if="item.messageType==='ALARM'">{{setTimes(item.data.alarm.time)}}</span>
                        <span v-if="item.messageType==='EVENT'">{{setTimes(item.data.date)}}</span>
                        <span v-if="item.messageType==='HK_PICTURE'">{{setTimes(item.data.reportingTime, 1)}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="topRight">
            <div id="map"></div>
          </div>
        </div>
        <div class="leftBottom">
          <div class="bottomLeft">
            <div class="title"
              style="margin-bottom:0px;">高位水池液位监控</div>
            <borderImg></borderImg>
            <div class="innerBox">
              <div id="leftBottomEcharts"></div>
            </div>
          </div>
          <div class="bottomRight">
            <div class="title">二供监控</div>
            <borderImg></borderImg>
            <div class="textInner">
              <div class="left">
                <ul>
                  <li>
                    <div>
                      <p class="spanLeft">设备总数:</p>
                    </div>
                  </li>
                  <li>
                    <div><em class="spanBg"
                        style="background: rgba(62, 255, 148, 1);box-shadow:0px 2px 6px 0px rgba(62,255,148,1);"></em>
                      <p class="spanLeft">正常:</p>
                    </div>
                  </li>
                  <li>
                    <div><em class="spanBg"
                        style="background:rgba(255,56,65,1);box-shadow:0px 2px 6px 0px rgba(255,56,65,0.6);"></em>
                      <p class="spanLeft">报警:</p>
                    </div>
                  </li>
                  <li>
                    <div><em class="spanBg"
                        style="background:rgba(181,181,181,1);box-shadow:0px 2px 6px 0px rgba(181,181,181,0.6);"></em>
                      <p class="spanLeft">离线:</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="right">
                <ul>
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.TOTAL || 0}}个</span></li>
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.NORMAL || 0}}个</span></li>
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.ABNORMAL || 0}}个</span></li>
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.offLine || 0}}个</span></li>
                </ul>
              </div>
              <!-- <ul>
              <li>
                <div>
                  <p class="spanLeft">设备总数:</p><span class="spanRight">298个</span>
                </div>
              </li>
              <li>
                <div><em class="spanBg"></em>
                  <p class="spanLeft">正常:</p><span class="spanRight">298个</span>
                </div>
              </li>
            </ul> -->
              <!-- <p>
              <span class="spanLeft">设备总数:</span><span class="spanRight">298个</span>
            </p>
            <p>
              <span class="spanBg"></span> <span class="spanLeft">正常:</span><span class="spanRight">298个</span>
            </p>
            <p>
              <span class="spanLeft">报警:</span><span class="spanRight">298个</span>
            </p>
            <p>
              <span class="spanLeft">离线:</span><span class="spanRight">298个</span>
            </p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="rightTop">
          <borderImg />
          <div class="titleF">
            <div class="title">管网监控</div>
          </div>
          <div class="box">
            <ul>
              <li>
                <div class="left">
                  <div class="box1">当前已有</div>
                  <div class="box2">
                    <p><span>管长：</span><span :title="this.pipeBNetwork.pipelineLength"
                        style="width: 50%;;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{this.pipeBNetwork.pipelineLength}}</span></p>
                    <p><span>阀门：</span><span>{{this.pipeBNetwork.valve}}</span></p>
                  </div>
                </div>
                <div class="right">
                  <div class="top">压力监测点</div>
                  <div class="bottom">
                    <div class="bg_wrap">
                      <div class="bgBox1"
                        id="piezometricPoint"></div>
                    </div>
                    <span>{{this.pipeBNetwork.piezometricPoint ? this.pipeBNetwork.piezometricPoint : 0}}</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="left">
                  <div class="box1">本月新增</div>
                  <div class="box2">
                    <p><span>管长：</span><span :title="this.pipeBNetwork.monthPipelineLength"
                        style="width: 50%;;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{this.pipeBNetwork.monthPipelineLength}}</span></p>
                    <p><span>阀门：</span><span>{{this.pipeBNetwork.monthFacilities}}</span></p>
                  </div>
                </div>
                <div class="right">
                  <div class="top">流量监测点</div>
                  <div class="bottom">
                    <div class="bg_wrap">
                      <div class="bgBox2"
                        id="flowPoints"></div>
                    </div>
                    <span>{{this.pipeBNetwork.flowPoints ? this.pipeBNetwork.flowPoints : 0}}</span>
                  </div>
                </div>
              </li>
              <li>
                <div class="left">
                  <div class="box1">管网压力</div>
                  <div class="box2">
                    <p><em class="bg1"></em><span>最高压力：</span><span>{{this.pipeBNetwork.maxTubePressure}}</span></p>
                    <p><em class="bg2"></em><span>最低压力：</span><span>{{this.pipeBNetwork.minTubePressure}}</span></p>
                  </div>
                </div>
                <div class="right">
                  <div class="top">水质监测点</div>
                  <div class="bottom">
                    <div class="bg_wrap">
                      <div class="bgBox3"
                        id="waterPoint"></div>
                    </div>
                    <span>{{this.pipeBNetwork.waterPoint  ? this.pipeBNetwork.waterPoint : 0}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="rightCenter">
          <borderImg />
          <div class="titleF">
            <div class="title">营收监控</div>
          </div>
          <div class="bottom">
            <el-carousel :interval="5000"
              style="flex:1;"
              :autoplay='false'
              indicator-position='none'
              arrow="always">
              <el-carousel-item v-for="(item, index) in 4"
                style="display:flex;"
                :key="item">
                <div class="bottom"
                  v-if="index === 0">
                  <div class="top">
                    <div class="topLeft">
                      <canvas class="canvas1"
                        width="110"
                        height="110"
                        id="canvas1"></canvas>
                    </div>
                    <div class="topRight">
                      <ul>
                        <!-- <li><em style="background:rgba(62,255,148,1);box-shadow:0px 2px 6px 0px rgba(62,255,148,1);"></em><span>水费回收率</span><span>{{this.waterRate.waterRecoveryRate}}%</span></li>
                        <li><em style="background:rgba(0,122,255,1);box-shadow:0px 2px 6px 0px rgba(0,122,255,0.6);"></em><span>用户欠费率</span><span>{{this.waterRate.arrearsRate}}%</span></li>
                        <li><em style="background:rgba(232,57,93,1);box-shadow:0px 2px 6px 0px rgba(232,57,93,0.6);"></em><span>用户在线率</span><span>{{this.waterRate.onLineRate}}%</span></li> -->
                        <li><em style="background:rgba(62,255,148,1);box-shadow:0px 2px 6px 0px rgba(62,255,148,1);"></em><span>水费回收率</span><span>15%</span></li>
                        <li><em style="background:rgba(0,122,255,1);box-shadow:0px 2px 6px 0px rgba(0,122,255,0.6);"></em><span>用户欠费率</span><span>15%</span></li>
                        <li><em style="background:rgba(232,57,93,1);box-shadow:0px 2px 6px 0px rgba(232,57,93,0.6);"></em><span>用户在线率</span><span>15%</span></li>
                      </ul>
                    </div>
                  </div>
                  <div class="bottoms">
                    <div id="chartsBox"></div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <!-- <div class="top">
              <div class="topLeft">
                <canvas class="canvas1"
                  width="110"
                  height="110"
                  id="canvas1"></canvas>
              </div>
              <div class="topRight">
                <ul>
                  <li><em style="background:rgba(62,255,148,1);box-shadow:0px 2px 6px 0px rgba(62,255,148,1);"></em><span>水费回收率</span><span>{{this.waterRate.waterRecoveryRate}}%</span></li>
                  <li><em style="background:rgba(0,122,255,1);box-shadow:0px 2px 6px 0px rgba(0,122,255,0.6);"></em><span>用户欠费率</span><span>{{this.waterRate.arrearsRate}}%</span></li>
                  <li><em style="background:rgba(232,57,93,1);box-shadow:0px 2px 6px 0px rgba(232,57,93,0.6);"></em><span>用户在线率</span><span>{{this.waterRate.onLineRate}}%</span></li>
                </ul>
              </div>
            </div>
            <div class="bottoms">
              <div id="chartsBox"></div>
            </div> -->
          </div>
        </div>
        <div class="rightBottom">
          <borderImg />
          <div class="titleF">
            <div class="title">原水监控</div>
          </div>
          <div class="bottom">
            <div class="left">
              <ul>
                <li><span>日用水量：</span><span>{{this.waterDailyAndMonth.dailyWater}}</span></li>
                <li><span>月用水量：</span><span>{{this.waterDailyAndMonth.monthWater}}</span></li>
              </ul>
            </div>
            <div class="right">
              <ul>
                <li>
                  <div><span class="span1">水泵：</span><span class="span2">{{this.waterPumpTotal.total}}</span></div>
                </li>
                <li>
                  <div style="margin-right:1vw"><em class="spanBg1"></em><span class="span1">正常：</span><span class="span2">{{this.waterPumpTotal.normal}}</span></div>
                  <div><em class="spanBg2"></em><span class="span1">报警：</span><span class="span2">{{this.waterPumpTotal.total-this.waterPumpTotal.normal}}</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MP from '@/assets/js/AmapAndUi'
import imgs from '@/assets/img/liua.png'
import borderImg from './borderImg'
import setTime from '@/assets/js/setTime'
import log from '@/assets/img/dp_mapImg.png'
export default {
  name: 'overview',
  data () {
    return {
      time: 0,
      timess: '',
      stationLists: [],
      consumptionData: {},
      pipeBNetwork: {},
      waterDailyAndMonth: {},
      waterPumpTotal: {},
      waterRate: {
        arrearsRate: 0,
        onLineRate: 0,
        total: 0,
        waterRecoveryRate: 0
      },
      waterData: [
        {
          title: '张易镇水厂',
          quantity: '19.1 m³',
          pressure: '0.8 MPa',
          level: '3.5 M',
          time: '3.4 H'
        },
        {
          title: '头营镇水厂',
          quantity: '20.4 m³',
          pressure: '0.8 MPa',
          level: '3.3 M',
          time: '4.2 H'
        },
        {
          title: '官厅镇水厂',
          quantity: '20.8 m³',
          pressure: '0.8 MPa',
          level: '3.5 M',
          time: '3.8 H'
        }
      ],
      equipmentTotalAndNormalAndAbNormalAndOffLine: {},
      infoWindow: '',
      map: '',
      mapobj: '',
      zuobiao: [],
      markerList: [],
      pipeList: [
      ],
      liuList: [],
      liudom: [],
      alarmType: [{
        name: 'LIQUID_LEVEL',
        val: '液位'
      },
      {
        name: 'PRESSURE',
        val: '压力'
      }, {
        name: 'BALANCE_OF_CL',
        val: '余氯'
      },
      {
        name: 'PH',
        val: 'PH'
      },
      {
        name: 'VOLTAGE',
        val: '电池电压'
      },
      {
        name: 'SWITCH01',
        val: '开关第一路'
      },
      {
        name: 'SWITCH02',
        val: '开关第二路'
      },
      {
        name: 'WATER_METER',
        val: '水表'
      }
      ]
    }
  },
  created () {
  },
  computed: {
    bulletinBoard () {
      return this.$store.state.dp_bulletinBoard
    }
  },
  mounted () {
    this.initAllStation()
    this.initpao()
    this.initData()
    this.initLeft()
    this.intaCharts()
    this.initMaps()
  },
  beforeDestroy () {
    window.clearInterval(this.timess)
  },
  methods: {
    async initAllStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationLists = res.data
      } else this.$message.error('站点数据获取失败')
    },
    setTimes (val, num = 1000) {
      return setTime({ date: val, number: num, type: 1 })
    },
    initMaps () {
      MP().then(data => {
        this.mapobj = data[0]
        window.initAMapUI()
        this.map = new this.mapobj.Map('map', {
          center: [106.28, 36.14],
          mapStyle: 'amap://styles/blue',
          features: ['building', 'road']
        })
        this.map.plugin(['AMap.DistrictSearch'], () => {
          new this.mapobj.DistrictSearch({
            extensions: 'all',
            subdistrict: 0,
            level: 'district'
          }).search('原州区', (status, result) => {
            let polygons = []
            let bounds = result.districtList[0].boundaries
            if (bounds) {
              for (let i = 0, l = bounds.length; i < l; i++) {
                // 生成行政区划polygon
                let polygon = new this.mapobj.Polygon({
                  strokeWeight: 3,
                  path: bounds[i],
                  fillOpacity: 0.4,
                  fillColor: '#80d8ff',
                  strokeColor: '#0091ea'
                })
                polygons.push(polygon)
              }
            }
            this.map.add(polygons)
          })
        })
        this.infoWindow = new this.mapobj.InfoWindow({
          offset: new this.mapobj.Pixel(0, -25),
          isCustom: true
        })
        window.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier, $) => {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          let defaultRenderOptions = {
            startPointStyle: null,
            endPointStyle: null,
            keyPointTolerance: -1,
            pathTolerance: 1,
            eventSupport: false,
            eventSupportInvisible: false,
            pathLineHoverStyle: false,
            pathLineStyle: {
              strokeStyle: '#fceb38',
              lineWidth: 4,
              borderStyle: '#db9b06',
              borderWidth: '0.5'
            },
            pathNavigatorStyle: {
              initRotateDegree: 0,
              width: 4,
              height: 8,
              autoRotate: true,
              lineJoin: 'round',
              fillStyle: '#000',
              pathLinePassedStyle: null,
              content: PathSimplifier.Render.Canvas.getImageContent(imgs, function onload () {
                // 图片加载成功，重新绘制一次
                pathSimplifierIns.renderLater()
              },
                function onerror (e) {
                  alert('图片加载失败！')
                })
            }
          }
          let pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            map: this.map, // 所属的地图实例
            clickToSelectPath: false,
            getPath: function (pathData, pathIndex) {
              return pathData.path
            },
            renderOptions: defaultRenderOptions
          })
          window.pathSimplifierIns = pathSimplifierIns
          // 设置数据
          let arr = []
          this.pipeList = []
          this.$api.product.getPipeData().then(res => {
            if (res.code === 200) {
              res.data.forEach(v => {
                // console.log(JSON.parse(v.coordinatePoint))
                this.pipeList.push(JSON.parse(v.coordinatePoint))
                this.zuobiao.push(JSON.parse(v.coordinatePoint)[0])
                // console.log(JSON.parse(v.coordinatePoint)[0])
              })
              this.zuobiao.forEach((item, index) => {
                let marker = new this.mapobj.Marker({
                  position: item,
                  icon: log,
                  extData: { stationId: index },
                  offset: new this.mapobj.Pixel(-13, -30)
                })
                let title = res.data[index].name
                marker.setLabel({
                  offset: new this.mapobj.Pixel(0, -28),
                  content: '<div class=\'info\'>' + title + '</div>',
                  direction: 'center' // 设置文本标注方位
                })
                marker.on('click', this.openWindows)
                this.markerList.push(marker)
                this.map.add(this.markerList)
              })
              this.pipeList.forEach((item, index) => {
                let obj = {}
                obj.name = `管道${index}`
                obj.path = item
                obj.km = Math.round(this.mapobj.GeometryUtil.distanceOfLine(item) / 1000)
                arr.push(obj)
              })
              pathSimplifierIns.setData(arr)
              // 对第一条线路（即索引 0）创建一个巡航器
              arr.forEach((item, index) => {
                for (let i = 0; i < item.km; i++) {
                  let navg1 = pathSimplifierIns.createPathNavigator(index, {
                    loop: true, // 循环播放
                    speed: 9000 // 巡航速度，单位千米/小时
                  })
                  setTimeout(() => {
                    navg1.start()
                  }, i * 500)
                }
              })
              this.map.setZoomAndCenter(10, [106.28, 36.14])
              // console.log(this.pipeList)
            }
          })
        })
      })
    },
    initData () {
      this.$api.waterSupply.getDailyDrugConsumption().then(res => {
        if (res.code === 200) {
          for (const key in res.data) {
            this.$set(this.consumptionData, key, res.data[key])
          }
        }
      })
      this.$api.waterSupply.getDailyWaterSupply().then(res => {
        if (res.code === 200) {
          for (const key in res.data) {
            this.$set(this.consumptionData, key, res.data[key])
          }
        }
      })
      this.$api.waterSupply.getServiceUsersAndEventReporting().then(res => {
        if (res.code === 200) {
          for (const key in res.data) {
            this.$set(this.consumptionData, key, res.data[key])
          }
        }
      })
      this.$api.waterSupply.getHightPollLc().then(res => {
        if (res.code === 200) {
          let key = res.data.xData
          let value = res.data.yData
          this.initLeft(key, value)
        }
      })
      this.$api.waterSupply.getHightPollLc().then(res => {
        if (res.code === 200) {
          let key = res.data.xData
          let value = res.data.yData
          this.initLeft(key, value)
        }
      })
      this.$api.waterSupply.getPipeBNetwork().then(res => {
        if (res.code === 200) {
          this.pipeBNetwork = res.data
          if (this.pipeBNetwork.pipelineLength) {
            this.pipeBNetwork.pipelineLength = this.pipeBNetwork.pipelineLength.toFixed(2)
          }
          if (this.pipeBNetwork.monthPipelineLength) {
            this.pipeBNetwork.monthPipelineLength = this.pipeBNetwork.monthPipelineLength.toFixed(2)
          }
          let piezometricPoint = document.getElementById('piezometricPoint')
          let flowPoints = document.getElementById('flowPoints')
          let waterPoint = document.getElementById('waterPoint')
          let sum = res.data.piezometricPoint + res.data.flowPoints + res.data.waterPoint
          let piezometricPoints = res.data.piezometricPoint ? res.data.piezometricPoint / sum * 100 : 0
          let flowPointss = res.data.flowPoints ? res.data.flowPoints / sum * 100 : 0
          let waterPoints = res.data.waterPoint ? res.data.waterPoint / sum * 100 : 0
          piezometricPoint.style.width = `${piezometricPoints}%`
          flowPoints.style.width = `${flowPointss}%`
          waterPoint.style.width = `${waterPoints}%`
        }
      })
      this.$api.waterSupply.getNearlyJuneWater().then(res => {
        if (res.code === 200) {
          let key = res.data.xData
          let value = res.data.yData
          this.intaCharts(key, value)
        }
      })
      this.$api.waterSupply.getWaterDailyAndMonth().then(res => {
        if (res.code === 200) {
          this.waterDailyAndMonth = res.data
        }
      })
      this.$api.waterSupply.getWaterPumpTotal().then(res => {
        if (res.code === 200) {
          this.waterPumpTotal = res.data
        }
      })
      this.$api.waterSupply.getWaterRate().then(res => {
        if (res.code === 200) {
          this.waterRate = res.data
          let one = document.getElementById('canvas1')
          this.drawMain(one, res.data.waterRecoveryRate, res.data.arrearsRate, res.data.onLineRate, '#42FF96', '#007AFF', '#E8395D', '#22646D', '#0D3D8F', '#53285D')
        }
      })
      this.$api.waterSupply.getEquipmentTotalAndNormalAndAbNormalAndOffLine().then(res => {
        if (res.code === 200) {
          this.equipmentTotalAndNormalAndAbNormalAndOffLine = res.data
        }
      })
      // this.$api.product.getPipeData().then(res => {
      //   if (res.code === 200) {
      //     this.pipeList = JSON.parse(res.data[0].coordinatePoint)
      //     console.log(JSON.parse(res.data[0].coordinatePoint))
      //   }
      // })
    },
    // 初始化显示百分比圆环
    // eslint-disable-next-line camelcase
    drawMain (drawing_elem, percent1, percent2, percent3, forecolor1, forecolor2, forecolor3, bgcolor1, bgcolor2, bgcolor3) {
      /*
          @drawing_elem: 绘制对象
          @percent：绘制圆环百分比, 范围[0, 100]
          @forecolor: 绘制圆环的前景色，颜色代码
          @bgcolor: 绘制圆环的背景色，颜色代码
      */
      let context = drawing_elem.getContext('2d')
      let centerX = drawing_elem.width / 2
      let centerY = drawing_elem.height / 2
      let rad = Math.PI * 2 / 100
      let speed = [0, 0, 0]
      let bg = [bgcolor1, bgcolor2, bgcolor3]
      let color = [forecolor1, forecolor2, forecolor3]
      let percent = [percent1, percent2, percent3]

      // 绘制背景圆圈
      function backgroundCircle () {
        for (let i = 0; i < 3; i++) {
          let r = 50 - i * 10
          context.save()
          context.beginPath()
          context.lineWidth = 10 // 设置线宽
          context.lineCap = 'round'
          context.strokeStyle = bg[i]
          context.arc(centerX, centerY, r, 0, Math.PI * 2, false)
          context.stroke()
          context.closePath()
          context.restore()
        }
      }

      // 绘制运动圆环
      function foregroundCircle (n) {
        for (let i = 0; i < 3; i++) {
          let r = 50 - i * 10

          context.save()
          context.strokeStyle = color[i]
          if (n[i] === 0) {
            context.lineWidth = 0
          } else {
            context.lineWidth = 10
          }
          context.lineCap = 'round'
          context.beginPath()
          context.arc(centerX, centerY, r, -Math.PI / 2, -Math.PI / 2 + n[i] * rad, false) // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
          context.stroke()
          context.closePath()
          context.restore()
        }
      }

      // 执行动画
      (function drawFrame () {
        window.requestAnimationFrame(drawFrame)
        context.clearRect(0, 0, drawing_elem.offsetWidth, drawing_elem.offsetHeight)
        backgroundCircle()
        foregroundCircle(speed)
        if (speed[0] < percent[0]) {
          speed[0] += 1
        }
        if (speed[1] < percent[1]) {
          speed[1] += 1
        }
        if (speed[2] < percent[2]) {
          speed[2] += 1
        }
        if (speed[0] === percent[0] && speed[1] === percent[1] && speed[2] === percent[2]) {
          return null
        }
      }())
    },
    initLeft (key, value) {
      let charts = this.$echarts.init(document.querySelector('#leftBottomEcharts'))

      charts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: { color: '#fff' },
          data: ['高位水池', '蓄水池'],
          top: '0%',
          right: '4%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            // data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            data: ['三营镇', '开城镇', '张易镇', '彭堡镇', '头营镇', '官厅镇', '黄铎堡镇', '中河乡', '河川乡', '炭山乡', '寨科乡'],
            axisLabel: {
              color: '#fff',
              fontSize: 12
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} m³',
              textStyle: {
                color: '#e9ecee',
                fontSize: 14
              }
            }
          }
        ],
        series: [
          {
            name: '高位水池',
            type: 'bar',
            stack: '广告',
            data: [32, 33, 30, 33, 39, 33, 32, 10, 15, 11, 16],
            itemStyle: {
              color: '#ff792c'
            },
            barWidth: '30PX'
          },
          {
            barWidth: '30PX',
            name: '蓄水池',
            type: 'bar',
            stack: '广告',
            data: [12, 13, 10, 13, 9, 23, 21, 10, 15, 11, 16],
            itemStyle: {
              color: '#2d9aff'
            }
          }
        ]
      })
      // charts.setOption({
      //   color: ['#3398DB'],
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'shadow'
      //     }
      //   },
      //   grid: {
      //     x: '6%', // 左上角x轴距盒子边框的距离
      //     y: '4%', // 左上角Y轴距盒子边框的距离
      //     x2: '3%', // 右下角x轴距盒子边框的距离
      //     y2: '15%', // 右下角Y轴距盒子边框的距离
      //     borderWidth: 1
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       data: key,
      //       // data: ['高位水池1', '高位水池2', '高位水池3', '高位水池4', '高位水池5'],
      //       axisTick: {
      //         alignWithLabel: true
      //       },
      //       axisLabel: {
      //         color: '#fff',
      //         fontSize: 14
      //       }
      //       // x轴线颜色
      //       // axisLine: {
      //       //   show: true,
      //       //   lineStyle: {
      //       //     color: '#fff',
      //       //     width: 1,
      //       //     type: 'solid'
      //       //   }
      //       // }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       axisLabel: {
      //         color: '#fff',
      //         fontSize: 14
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '液位',
      //       type: 'bar',
      //       barWidth: '30PX',
      //       // data: [15, 18, 14, 12, 8],
      //       data: value,
      //       itemStyle: {
      //         normal: {
      //           color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
      //             offset: 0,
      //             color: '#E25C1A' // 0% 处的颜色
      //           }, {
      //             offset: 1,
      //             color: '#EC986E' // 100% 处的颜色
      //           }], false)
      //         }
      //       }
      //     }
      //   ]
      // }
      // )
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    initpao () {
      if (this.bulletinBoard.length !== 0) {
        this.timess = setInterval(() => {
          this.time--
          let top = parseFloat(this.$refs.ulBox.style.top)
          if ((top + this.$refs.ulBox.offsetHeight) <= 0) {
            this.time = this.$refs.ulFatherBox.offsetHeight
          }
          this.$refs.ulBox.style.top = `${this.time}px`
        }, 50)
      }
    },
    stopTime () {
      window.clearInterval(this.timess)
    },
    intaCharts (xData, yData) {
      let charts = this.$echarts.init(document.querySelector('#chartsBox'))
      charts.setOption({
        title: {
          text: '近六月售水量统计',
          // x: 'right',
          // y: 'top',
          textStyle: {
            color: '#00EAFF',
            fontSize: 14
          },
          right: '5%',
          padding: [
            0, // 上
            0, // 右
            7, // 下
            0 // 左
          ]
        },
        grid: {
          x: '15%', // 左上角x轴距盒子边框的距离
          y: '15%', // 左上角Y轴距盒子边框的距离
          x2: '6%', // 右下角x轴距盒子边框的距离
          y2: '20%', // 右下角Y轴距盒子边框的距离
          borderWidth: 1
        },
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   textStyle: { color: '#fff' },
        //   data: ['', '', '', '日用水量', '日用电量'],
        //   x: 'center',
        //   y: 'top'
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLabel: {
            color: '#fff',
            fontSize: 14
          }
        },
        yAxis: {
          type: 'value',
          // min: 0,
          // max: 100,
          position: 'left',
          axisLabel: {
            formatter: '{value} m³',
            textStyle: {
              color: '#e9ecee',
              fontSize: 14
            }
          }
        },
        series: [
          {
            name: '日用水量',
            data: yData,
            type: 'line',
            itemStyle: {
              color: '#00e2ff'
            },
            areaStyle: {}
          }
        ]
      })
      window.addEventListener('resize', function () {
        charts.resize()
      })
    }
  },
  components: {
    borderImg
  }
}
</script>

<style lang="scss" scoped>
/deep/ .amap-marker-label {
  border-color: #ccc !important;
  border-radius: 5px !important;
  font-weight: 700 !important;
}
.wscBox {
  width: 100%;
  flex: 1;
  display: flex;
  // justify-content: space-between;
  background: url("../../assets/img/dp_bg.png");
  box-sizing: border-box;
  padding: 0 1.25vw 0.9895vw 1.25vw;
  flex-direction: column;
}
.noneBox {
  height: 30px;
  width: 100%;
  margin-top: 0.5208vw;
}
.content {
  flex: 1;
  margin-top: 0.5208vw;
  display: flex;
  justify-content: space-between;
  .leftBox {
    width: 65.298%;
    height: 100%;
    // background: red;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .leftTop {
      height: 67.03%;
      width: 100%;
      // background: brown;
      display: flex;
      margin-bottom: 0.5208vw;
      .topLeft {
        width: 43%;
        height: 100%;
        // background: black;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        .topOne {
          height: 50.8%;
          position: relative;
          width: 100%;
          // margin-bottom: 0.95%;
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 10px;
          background: rgba(66, 146, 255, 0.1);
          display: flex;
          box-sizing: border-box;
          padding: 3.787% 0 5.176% 6.816%;
          margin-bottom: 0.5208vw;
          // padding: 1% 1%;
          ul {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          li:nth-child(odd) {
            // margin-right: 15.3125%;
            // margin-right: 32px;
          }
          li {
            // flex: 1;
            // width: 40%;
            // float: left;
            color: rgba(219, 231, 250, 1);
            display: flex;
            font-size: 0.8333vw;
            // margin-bottom: 1.3vw;
            // margin-bottom: 7.8475%;
            .box {
              flex: 1;
              display: flex;
            }
            img {
              // width: 25.6%;
              // height: 29.697%;
              width: 2.8125vw;
              height: 2.8125vw;
              // margin-right: 34px;
              margin-right: 17.34%;
            }
            .p {
              // margin-top: 7px;
              margin-top: 8.61%;
              margin-bottom: 11.07%;
            }
          }
        }
        .topTwo {
          height: 47.54%;
          position: relative;
          width: 100%;
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 10px;
          background: rgba(66, 146, 255, 0.1);
          box-sizing: border-box;
          // padding: 0 36px;
          padding: 0 6.816%;
          display: flex;
          flex-direction: column;

          .title {
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            width: 26.42%;
            height: 10.34%;
            background: rgba(9, 23, 59, 1);
            border: 1px solid rgba(66, 146, 255, 1);
            border-radius: 0px 0px 4px 4px;
            margin: 0 auto;
            color: rgba(219, 231, 250, 1);
            text-align: center;
            font-size: 0.8333vw;
            margin-bottom: 2.5%;
          }
          .ulBox {
            flex: 1;
            position: relative;
            overflow: hidden;

            ul {
              box-sizing: border-box;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: auto;

              li {
                width: 100%;
                margin-bottom: 4.618%;
                padding-bottom: 1%;
                border-bottom: 1px solid rgba(1, 95, 168, 1);

                .liBox {
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  .liBoxOne {
                    font-size: 0.83vw;
                    color: rgba(219, 231, 250, 1);
                    margin-bottom: 0.9vw;
                  }
                  .liBoxTwo {
                    display: flex;
                    justify-content: space-between;
                    color: white;
                    font-size: 0.73vw;
                  }
                }
              }
            }
          }
        }
      }
      .topRight {
        margin-left: 0.5208vw;
        flex: 1;
        height: 100%;
        #map {
          width: 100%;
          height: 100%;
          background: rgba(9, 19, 72, 0.490196) !important;
        }
      }
    }
    .leftBottom {
      height: 31.86%;
      width: 100%;
      display: flex;
      // justify-content: space-between;
      .bottomLeft {
        width: 70%;
        height: 100%;
        position: relative;
        border: 1px solid rgba(66, 146, 255, 1);
        border-radius: 10px;
        background: rgba(66, 146, 255, 0.1);
        display: flex;
        flex-direction: column;
        margin-right: 0.5208vw;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          height: 13.812%;
          width: 20.9448%;
          background: rgba(9, 23, 59, 1);
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 0px 0px 4px 4px;
          margin: 0 auto;
          color: rgba(219, 231, 250, 1);
          text-align: center;
          font-size: 0.8333vw;
          margin-bottom: 2.5%;
        }
        .innerBox {
          flex: 1;
          #leftBottomEcharts {
            height: 100%;
            width: 100%;
          }
        }
      }
      .bottomRight {
        width: 29%;
        height: 100%;
        position: relative;
        border: 1px solid rgba(66, 146, 255, 1);
        border-radius: 10px;
        background: rgba(66, 146, 255, 0.1);
        display: flex;
        flex-direction: column;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          height: 13.812%;
          width: 39.2927%;
          background: rgba(9, 23, 59, 1);
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 0px 0px 4px 4px;
          margin: 0 auto;
          color: rgba(219, 231, 250, 1);
          text-align: center;
          font-size: 0.8333vw;
          margin-bottom: 9.2618%;
        }
        .textInner {
          flex: 1;
          width: 100%;
          box-sizing: border-box;
          padding-left: 23.014%;
          padding-bottom: 1.5583vw;
          display: flex;
          .left {
            // flex: 1;
            display: flex;
            margin-right: 16.11%;
            height: 100%;
            flex-direction: column;
            ul {
              flex: 1;
              width: 100%;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              li {
                width: 100%;
                // margin-bottom: 14.63%;
                div {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                }
              }
            }
          }
          .right {
            // flex: 1;
            display: flex;
            height: 100%;
            flex-direction: column;
            ul {
              flex: 1;
              width: 100%;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              li {
                width: 100%;
                // margin-bottom: 14.63%;
              }
            }
          }
        }
        .spanLeft {
          color: #00eaff;
          font-size: 0.9375vw;
        }
        .spanRight {
          color: rgba(219, 231, 250, 1);
          font-size: 1.041vw;
        }
        .spanBg {
          display: block;
          width: 16px;
          height: 8px;
          border-radius: 4px;
        }
      }
    }
  }
  .rightBox {
    width: 34.13%;
    height: 100%;
    // background: blue;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .rightTop {
      height: 32.96%;
      width: 100%;
      position: relative;
      border: 1px solid #4292ff;
      border-radius: 10px;
      background: rgba(66, 146, 255, 0.1);
      display: flex;
      flex-direction: column;
      margin-bottom: 0.5208vw;
      .titleF {
        width: 100%;
        display: flex;
        justify-content: center;
        .title {
          padding: 0.3271vw 1.6355vw;
          background: rgba(9, 23, 59, 1);
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 0px 0px 4px 4px;
          color: rgba(219, 231, 250, 1);
          // font-size: 0.8333vw;
          font-size: 0.7476vw;
          margin-bottom: 0.908vw;
        }
      }
      .box {
        flex: 1;
        display: flex;
        flex-direction: column;
        ul {
          flex: 1;
          padding-bottom: 1.283vw;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        li {
          width: 100%;
          display: flex;
          // margin-bottom: 1vw;
          .left {
            flex: 1;
            display: flex;
            padding-left: 6.2745%;
            .box1 {
              font-size: 0.7473vw;
              color: rgba(0, 234, 255, 1);
              margin-right: 3.4504%;
            }
            .box2 {
              flex: 1;
              font-size: 0.7473vw;
              color: rgba(219, 231, 250, 1);
              margin-right: 1vw;

              p {
                display: flex;
                align-items: center;
              }
              .bg1,
              .bg2 {
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(232, 57, 93, 1);
                box-shadow: 0px 2px 6px 0px rgba(232, 57, 93, 1);
                margin-right: 0.3125vw;
              }
              .bg2 {
                background: rgba(124, 0, 255, 1);
                box-shadow: 0px 2px 6px 0px rgba(124, 0, 255, 1);
              }
            }
            .box2 > p:first-child {
              // margin-bottom: 18.5528%;
              margin-bottom: 0.6192vw;
            }
            .box2 > p > span:first-child {
              margin-right: 0.625vw;
            }
          }
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            .top {
              font-size: 0.84vw;
              color: rgba(0, 234, 255, 1);
              margin-bottom: 0.84vw;
            }
            .bottom {
              display: flex;
              align-items: center;
              .bg_wrap {
                height: 0.4672vw;
                width: 67%;
                background: rgba(181, 181, 181, 0.3);
                border-radius: 5px;
                margin-right: 0.5729vw;
              }
              div {
                height: 100%;
                width: 60%;
                border-radius: 5px;
              }
              .bgBox1 {
                background: rgba(62, 255, 148, 1);
              }
              .bgBox2 {
                background: rgba(0, 122, 255, 1);
              }
              .bgBox3 {
                background: rgba(255, 174, 0, 1);
              }
              span {
                font-size: 0.7473vw;
                color: rgba(219, 231, 250, 1);
              }
            }
          }
        }
        ul > li:last-child {
          margin-bottom: 0;
        }
      }
    }
    .rightCenter {
      height: 43.95%;
      width: 100%;
      position: relative;
      border: 1px solid #4292ff;
      border-radius: 10px;
      background: rgba(66, 146, 255, 0.1);
      display: flex;
      flex-direction: column;
      margin-bottom: 0.5208vw;
      .titleF {
        width: 100%;
        display: flex;
        justify-content: center;
        .title {
          padding: 0.3271vw 1.6355vw;
          background: rgba(9, 23, 59, 1);
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 0px 0px 4px 4px;
          color: rgba(219, 231, 250, 1);
          // font-size: 0.8333vw;
          font-size: 0.7476vw;
          margin-bottom: 0.908vw;
        }
      }
      .bottom {
        flex: 1;
        display: flex;
        flex-direction: column;
        .top {
          // flex: 1;
          // background: red;
          display: flex;
          align-items: center;
          .topLeft {
            padding-left: 3.854vw;
            margin-right: 3.33vw;
            width: 5.7944vw;
            height: 5.7944vw;
            .canvas1 {
            }
          }
          .topRight {
            display: flex;
            flex-direction: column;
            li {
              display: flex;
              align-items: center;
              margin-bottom: 0.8878vw;
              span {
                font-size: 0.841125vw;
                color: rgba(219, 231, 250, 1);
              }
              em {
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                margin-right: 0.26vw;
              }
            }
          }
          .topRight > ul > li:last-child {
            margin-bottom: 0;
          }
          .topRight > ul > li > span:first-of-type {
            margin-right: 0.416vw;
          }
        }
        .bottoms {
          flex: 1;
          width: 100%;
          // background: pink;
          #chartsBox {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .rightBottom {
      height: 20.87%;
      width: 100%;
      position: relative;
      border: 1px solid #4292ff;
      border-radius: 10px;
      background: rgba(66, 146, 255, 0.1);
      display: flex;
      flex-direction: column;
      .titleF {
        width: 100%;
        display: flex;
        justify-content: center;
        .title {
          padding: 0.3271vw 1.6355vw;
          background: rgba(9, 23, 59, 1);
          border: 1px solid rgba(66, 146, 255, 1);
          border-radius: 0px 0px 4px 4px;
          color: rgba(219, 231, 250, 1);
          // font-size: 0.8333vw;
          font-size: 0.7476vw;
          margin-bottom: 1.495vw;
        }
      }
      .bottom {
        display: flex;
        padding-left: 1.7289vw;
        .left {
          flex: 1;
          li {
            margin-bottom: 1.542vw;
          }
          span {
            font-size: 0.9345vw;
            color: rgba(219, 231, 250, 1);
          }
        }
        .left > ul > li > span:last-child {
          font-weight: bold;
          text-shadow: 0px 2px 6px rgba(219, 231, 250, 0.6);
        }
        .right {
          flex: 1;
          li {
            display: flex;
            // justify-content: space-between;
            margin-bottom: 1.542vw;
            div {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
          .span1 {
            font-size: 0.9345vw;
            color: rgba(0, 234, 255, 1);
          }
          .span2 {
            font-size: 0.9345vw;
            font-weight: bold;
            color: rgba(219, 231, 250, 1);
          }
          .spanBg1,
          .spanBg2 {
            display: block;
            width: 8px;
            height: 8px;
            background: rgba(62, 255, 148, 1);
            box-shadow: 0px 2px 6px 0px rgba(62, 255, 148, 1);
            border-radius: 4px;
            margin-right: 0.29vw;
          }
          .spanBg2 {
            background: rgba(255, 56, 65, 1);
            box-shadow: 0px 2px 6px 0px rgba(255, 56, 65, 0.6);
          }
        }
      }
    }
  }
}
/deep/ .el-carousel__container {
  height: 100%;
}
</style>
