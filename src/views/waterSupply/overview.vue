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
                      <p>3625</p>
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
            <div class="title">设备监控</div>
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
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.TOTAL || 0}} 个</span></li>
                  <li><span class="spanRight">10 个</span></li>
                  <li><span class="spanRight">0 个</span></li>
                  <li><span class="spanRight">{{this.equipmentTotalAndNormalAndAbNormalAndOffLine.offLine || 0}} 个</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="rightTop">
          <borderImg />
          <div class="titleF">
            <div class="title">水质状态</div>
          </div>
          <div class="box swiper-container">
            <ul class="ul1 swiper-wrapper">
              <li class="li1 swiper-slide" v-for="item in numList" :key="item.num1">
                <div class="liLeft">
                  <ul>
                    <li>
                      <h3 style="text-align: center">{{item.stationName}}</h3>
                    </li>
                    <li>
                      <div style="width: 20%;">
                        <img src="../../assets/img/dp_6.png" alt="">
                      </div>
                      <span class="span1" style="width: 20%;">余氯值</span>
                      <p style="color: #ffae45;width: 35%;">标准：0.32~0.36mg/l</p>
                      <em style="width: 15%">0.3{{item.num1}}</em>
                      <span style="color: #39800B">正常</span>
                    </li>
                    <li>
                      <div style="width: 20%;">
                        <img src="../../assets/img/dp_8.png" alt="">
                      </div>
                      <span class="span1 span3" style="color: #00d7e9;width: 20%;">PH值</span>
                      <p style="color: #00d7e9;width: 35%;">标准：7.11~7.99</p>
                      <em style="width: 15%">7.{{item.num2}}</em>
                      <span style="color: #39800B">正常</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div class="swiper-pagination"></div>
          </div>
        </div>
        <div class="rightCenter">
          <borderImg />
          <div class="titleF">
            <div class="title">营收监控</div>
          </div>
          <div class="bottom">
            <div class="top">
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
            </div>
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
// import imgs from '@/assets/img/liua.png'
import borderImg from './borderImg'
import setTime from '@/assets/js/setTime'
import red from '@/assets/img/red.gif'
import gray from '@/assets/img/gray.gif'
import yellow from '@/assets/img/yellow.gif'
import green from '@/assets/img/green.gif'
export default {
  name: 'overview',
  data () {
    return {
      numList: [
        {
          stationName: '贺家湾水厂',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        },
        {
          stationName: '唐家坪泵站',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        },
        {
          stationName: '中河泵站',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        },
        {
          stationName: '辽坡泵站',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        },
        {
          stationName: '祁家庄泵站',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        },
        {
          stationName: '石庄泵站',
          num1: Math.floor(Math.random() * (6 - 2) + 2),
          num2: Math.floor(Math.random() * (99 - 11) + 11)
        }
      ],
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
      waterQualityList: [
        {
          aboveThresholdCount: 0,
          belowThresholdCount: 0,
          normalCount: 0,
          offLine: 0
        },
        {
          aboveThresholdCount: 0,
          belowThresholdCount: 0,
          normalCount: 0,
          offLine: 0
        }
      ],
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
      ],
      leftEchasIndex: 0 // 营收左右点击index
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
    // 饼图
    this.initSwper()
    // this.pieCharts()
  },
  beforeDestroy () {
    window.clearInterval(this.timess)
  },
  methods: {
    initSwper () {
      // eslint-disable-next-line no-new
      new this.$swiper('.swiper-container', {
        effect: 'flip',
        autoplay: true,
        speed: 800,
        loop: true, // 循环模式选项
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination'
        }
      })
    },
    // 水质状态的饼图
    pieCharts () {
      // 第一个饼图
      let fn1 = () => {
        let charts = this.$echarts.init(document.querySelector('#waterEcharts1'))
        charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          grid: {
            x: '0', // 左上角x轴距盒子边框的距离
            y: '0', // 左上角Y轴距盒子边框的距离
            x2: '0', // 右下角x轴距盒子边框的距离
            y2: '0', // 右下角Y轴距盒子边框的距离
            borderWidth: 1
          },
          series: [
            {
              // center: ['50%', '50%'],
              name: '余氯值',
              type: 'pie',
              radius: ['70%', '100%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: this.waterQualityList[0].normalCount, name: '正常', itemStyle: { normal: { color: '#FFAE45' } } },
                { value: this.waterQualityList[0].aboveThresholdCount + this.waterQualityList[0].belowThresholdCount, name: '报警', itemStyle: { normal: { color: '#B48245' } } },
                { value: this.waterQualityList[0].offLine, name: '离线', itemStyle: { normal: { color: '#685545' } } }
              ]
            }
          ]
        })
        window.addEventListener('resize', function () {
          charts.resize()
        })
      }
      // 第二个饼图
      let fn2 = () => {
        let charts = this.$echarts.init(document.querySelector('#waterEcharts2'))
        charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          grid: {
            x: '0', // 左上角x轴距盒子边框的距离
            y: '0', // 左上角Y轴距盒子边框的距离
            x2: '0', // 右下角x轴距盒子边框的距离
            y2: '0', // 右下角Y轴距盒子边框的距离
            borderWidth: 1
          },
          series: [
            {
              name: '余氯值',
              type: 'pie',
              radius: ['70%', '100%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                { value: this.waterQualityList[1].normalCount, name: '正常', itemStyle: { normal: { color: '#00D7E9' } } },
                { value: this.waterQualityList[1].aboveThresholdCount + this.waterQualityList[1].belowThresholdCount, name: '报警', itemStyle: { normal: { color: '#028BA7' } } },
                { value: this.waterQualityList[1].offLine, name: '离线', itemStyle: { normal: { color: '#035377' } } }
              ]
            }
          ]
        })
        window.addEventListener('resize', function () {
          charts.resize()
        })
      }
      fn1()
      fn2()
    },
    async initAllStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationLists = res.data
        this.initMaps()
      } else this.$message.error('站点数据获取失败')
    },
    setTimes (val, num = 1000) {
      return setTime({ date: val, number: num, type: 1 })
    },
    // 初始化地图
    initMaps () {
      MP().then(AMap => {
        let times = new Date().getTime()
        let time = setTime({ date: times, number: 1, type: 1 })
        this.mapObj = AMap[0]
        this.map = new this.mapObj.Map('map', {
          mapStyle: 'amap://styles/darkblue',
          zoom: 10,
          center: [106.28, 36.14]
        })
        this.map.plugin(['AMap.DistrictSearch'], () => {
          new this.mapObj.DistrictSearch({
            extensions: 'all',
            subdistrict: 0,
            level: 'district'
          }).search('原州区', (status, result) => {
            let polygons = []
            let bounds = result.districtList[0].boundaries
            if (bounds) {
              for (let i = 0, l = bounds.length; i < l; i++) {
                // 生成行政区划polygon
                let polygon = new this.mapObj.Polygon({
                  strokeWeight: 3,
                  path: bounds[i],
                  fillOpacity: 0.4,
                  fillColor: '#1965e7',
                  strokeColor: '#1965e7',
                  bubble: true
                })
                polygons.push(polygon)
              }
            }
            this.map.on('click', this.closeInfo)
            this.map.add(polygons)
          })
        })
        this.infoWindow = new this.mapObj.InfoWindow({ offset: new this.mapObj.Pixel(0, -55), isCustom: true })
        this.stationLists.forEach((item, index) => {
          if (item.typeId === '4028fc876cad69f6016cad76c2930015' || item.typeId === 'f2b76b906c7567a3016c7568dd920000' || item.typeId === '4028fc876cad69f6016cad6f85a90012') {
            let arr = []
            arr.push(item.lng)
            arr.push(item.lat)
            let icon = null
            let title = null
            let content = null
            let bg = null
            switch (index) {
              case 0:
                icon = red
                title = item.name
                bg = '#c41b1b'
                content = `<li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">报警内容</span>
                                        <p style="background: #4a0101;width: 130px;text-align: center">ph过高</p>
                                    </li>
                                    <li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">报警时间</span>
                                        <p style="background: #4a0101;width: 160px;text-align: center">${time}</p>
                                    </li>`
                break
              case 1:
                icon = gray
                title = item.name
                bg = '#787575'
                content = `<li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">离线时间</span>
                                        <p style="background: #4a0101;width: 160px;text-align: center">${time}</p>
                                       </li>`
                break
              case 2:
                icon = yellow
                title = item.name
                bg = '#f48d13'
                content = `<li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">预警内容</span>
                                        <p style="background: #4a0101;width: 130px;text-align: center">压力预警 压力偏低</p>
                                       </li>
                                       <li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">预警时间</span>
                                        <p style="background: #4a0101;width: 160px;text-align: center">${time}</p>
                                       </li>`
                break
              default:
                icon = green
                title = item.name
                bg = '#2FCA67'
                content = ``
            }
            let marker = new this.mapObj.Marker({
              position: arr,
              icon: icon,
              extData: { stationId: index },
              offset: new this.mapObj.Pixel(-40, -80)
            })
            let a = title.length
            let num = 37 - (a * 6)
            marker.setLabel({
              offset: new this.mapObj.Pixel(num, -5),
              content: '<div class=\'info\'>' + title + '</div>'
            })
            marker.content = `<div style="color: #fff;border: 1px solid ${bg};background:${bg};padding: 10px;border-radius: 5px">
                                        <h3 style="font-weight: 700;font-size: 16px;margin-bottom: 10px;">${title}</h3>
                                        <ul>${content}</ul>
                                    </div>`
            marker.on('click', this.markerClick)
            this.markerList.push(marker)
          }
        })
        this.map.add(this.markerList)
      })
    },
    initData () {
      this.$api.waterSupply.getWaterQualityList().then(res => {
        if (res.code === 200) {
          this.waterQualityList = res.data
        }
      })
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
          // let key = res.data.xData
          // let value = res.data.yData
          this.intaCharts()
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
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          textStyle: { color: '#fff' },
          data: ['高位水池'],
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
            // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
            data: ['三营镇', '头营镇', '张易镇', '开城镇', '河川乡', '寨科乡', '炭山乡', '中河乡', '彭堡镇', '官厅镇', '黄铎堡镇'],
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
              formatter: '{value} M',
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
            data: [3.2, 3.4, 3.0, 4.2, 3.9, 3.3, 3.2, 2.8, 3.4, 3.6, 4.4],
            itemStyle: {
              color: '#ff792c'
            },
            barWidth: '30PX'
          }
          // {
          //   barWidth: '30PX',
          //   name: '蓄水池',
          //   type: 'bar',
          //   stack: '广告',
          //   data: [12, 13, 10, 13, 9, 23, 21, 10, 15, 11, 16],
          //   itemStyle: {
          //     color: '#2d9aff'
          //   }
          // }
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
          text: `九月售水量统计`,
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
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          x: '10%', // x左
          y: '10%', // Y上
          x2: '1%', // x右
          y2: '20%', // y下
          borderWidth: 1
        },
        xAxis: [
          {
            type: 'category',
            // data: key,
            data: ['三营镇', '头营镇', '张易镇', '开城镇', '河川乡', '寨科乡', '炭山乡', '中河乡', '彭堡镇', '官厅镇', '黄铎堡镇'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#fff',
              fontSize: 14,
              interval: 0,
              rotate: 30
            },
            // x轴线颜色
            axisLine: {
              show: true,
              lineStyle: {
                color: '#fff',
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        yAxis: [
          {
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
          }
        ],
        series: [
          {
            name: '月售水量',
            type: 'bar',
            barWidth: '30PX',
            // data: [15, 18, 14, 12, 8],
            data: [80, 77, 90, 60, 120, 110, 88, 130, 92, 100, 89],
            // data: value,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#E25C1A' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#EC986E' // 100% 处的颜色
                }], false)
              }
            }
          }
        ]
      }
      )
      // charts.setOption({
      //   title: {
      //     text: '近六月售水量统计',
      //     // x: 'right',
      //     // y: 'top',
      //     textStyle: {
      //       color: '#00EAFF',
      //       fontSize: 14
      //     },
      //     right: '5%',
      //     padding: [
      //       0, // 上
      //       0, // 右
      //       7, // 下
      //       0 // 左
      //     ]
      //   },
      //   grid: {
      //     x: '15%', // 左上角x轴距盒子边框的距离
      //     y: '15%', // 左上角Y轴距盒子边框的距离
      //     x2: '6%', // 右下角x轴距盒子边框的距离
      //     y2: '20%', // 右下角Y轴距盒子边框的距离
      //     borderWidth: 1
      //   },
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   // legend: {
      //   //   textStyle: { color: '#fff' },
      //   //   data: ['', '', '', '日用水量', '日用电量'],
      //   //   x: 'center',
      //   //   y: 'top'
      //   // },
      //   xAxis: {
      //     type: 'category',
      //     boundaryGap: false,
      //     data: xData,
      //     axisLabel: {
      //       color: '#fff',
      //       fontSize: 14
      //     }
      //   },
      //   yAxis: {
      //     type: 'value',
      //     // min: 0,
      //     // max: 100,
      //     position: 'left',
      //     axisLabel: {
      //       formatter: '{value} m³',
      //       textStyle: {
      //         color: '#e9ecee',
      //         fontSize: 14
      //       }
      //     }
      //   },
      //   series: [
      //     {
      //       name: '日用水量',
      //       data: yData,
      //       type: 'line',
      //       itemStyle: {
      //         color: '#00e2ff'
      //       },
      //       areaStyle: {}
      //     }
      //   ]
      // })
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
          width: 25.9448%;
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
        // background: red;
        // margin-top: 1.145vw;
        // margin-left: 1.5625vw;
        margin: 0 1vw;
        display: flex;
        flex-direction: column;
        flex: 1;
        .ul1 {
          display: flex;
          justify-content: space-between;
          flex: 1;
          .li1 {
            width: 100%;
            height: 100%;
            display: flex;
            .liLeft{
              width: 100%;
              height: 100%;
              ul{
                width: 100%;
                height: 100%;
                li{
                  display: flex;
                  align-items: center;
                  font-size: 16px;
                  color: #FFF;
                  margin-bottom: 20px;
                }
                li:nth-child(1) {
                  justify-content: flex-start;
                  font-size: 18px;
                  font-weight: 700;
                }
                div{
                  margin-right: 10px;
                }
                span{
                  font-size: .9375vw;
                  color: #ffae45;
                  font-weight: 700;
                }
              }
            }
          }
        }
        /*.liLeft {*/
        /*  // width: 40%;*/
        /*  width: 40%;*/
        /*  height: 100%;*/
        /*  // flex: 1;*/
        /*  display: flex;*/
        /*  // align-items: center;*/
        /*  ul {*/
        /*    flex: 1;*/
        /*    display: flex;*/
        /*    // align-items: center;*/
        /*    flex-direction: column;*/
        /*    li {*/
        /*      display: flex;*/
        /*      width: 100%;*/
        /*      align-items: center;*/
        /*      img {*/
        /*        margin-right: 0.8854vw;*/
        /*        width: 2.0833vw;*/
        /*        height: 2.0833vw;*/
        /*      }*/
        /*      .noneImg {*/
        /*        width: 2.0833vw;*/
        /*        height: 2.0833vw;*/
        /*      }*/
        /*      .emBg1,*/
        /*      .emBg2 {*/
        /*        display: block;*/
        /*        width: 8px;*/
        /*        height: 8px;*/
        /*        background: rgba(255, 174, 69, 1);*/
        /*        border-radius: 50%;*/
        /*        margin-right: 0.45vw;*/
        /*      }*/
        /*      .emBg2 {*/
        /*        background: rgba(0, 215, 233, 1);*/
        /*      }*/
        /*      .span1 {*/
        /*        font-size: 0.9375vw;*/
        /*        font-weight: bold;*/
        /*        color: rgba(255, 174, 69, 1);*/
        /*        margin-right: 0.9895vw;*/
        /*      }*/
        /*      .span2 {*/
        /*        font-size: 0.833vw;*/
        /*        font-weight: bold;*/
        /*        color: rgba(219, 231, 250, 1);*/
        /*        margin-right: 0.9895vw;*/
        /*      }*/
        /*      .span3 {*/
        /*        color: rgba(0, 215, 233, 1);*/
        /*      }*/
        /*    }*/
        /*  }*/
        /*  .lastLi {*/
        /*    flex: 1;*/
        /*    ul {*/
        /*      height: 100%;*/
        /*      justify-content: space-around;*/
        /*    }*/
        /*    li {*/
        /*      // margin-bottom: 0.5958vw;*/
        /*      // align-items: normal;*/
        /*    }*/
        /*  }*/
        /*  .lastLi li:last-child {*/
        /*    margin-bottom: 0;*/
        /*  }*/
        /*  // .span1 {*/
        /*  //   font-size: 0.9375vw;*/
        /*  //   font-weight: bold;*/
        /*  //   color: rgba(255, 174, 69, 1);*/
        /*  //   // margin-right: 3.3854vw;*/
        /*  // }*/
        /*  // .span2 {*/
        /*  //   font-size: 0.9375vw;*/
        /*  //   color: rgba(255, 174, 69, 1);*/
        /*  // }*/
        /*}*/
        // .innerTop {
        //   margin-bottom: 0.458vw;

        /*.liRight {*/
        /*  flex: 1;*/
        /*  width: 40%;*/
        /*  height: 100%;*/
        /*  // background: pink;*/
        /*  display: flex;*/
        /*  flex-direction: column;*/
        /*  .box1 {*/
        /*    width: 100%;*/
        /*    display: flex;*/
        /*    // justify-content: center;*/
        /*    height: 2.0833vw;*/
        /*    align-items: center;*/
        /*  }*/
        /*  .span2 {*/
        /*    font-size: 0.9375vw;*/
        /*    color: rgba(255, 174, 69, 1);*/
        /*  }*/
        /*  .span3 {*/
        /*    color: rgba(0, 215, 233, 1);*/
        /*  }*/
        /*  .box2 {*/
        /*    width: 100%;*/
        /*    display: flex;*/
        /*    flex: 1;*/
        /*    align-items: center;*/
        /*    // justify-content: center;*/
        /*  }*/
        /*  .waterEcharts {*/
        /*    width: 70%;*/
        /*    height: 70%;*/
        /*    // width: 4.375vw;*/
        /*    // height: 4.375vw;*/
        /*    // background: red;*/
        /*    // margin-right: 4.947vw;*/
        /*  }*/
        /*}*/
        // .innerBottom {
        //   .liLeft {
        //     display: flex;

        //     ul {
        //       li {
        //         display: flex;
        //         align-items: center;
        //         margin-bottom: 0.5958vw;
        //         span {
        //           font-size: 0.833vw;
        //           font-weight: bold;
        //           color: rgba(219, 231, 250, 1);
        //         }
        //         .span1 {
        //           margin-right: 0.9895vw;
        //         }
        //       }
        //     }

        //   }
        // }
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
          display: flex;
          #chartsBox {
            flex: 1;
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
