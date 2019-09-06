<template>
  <div class="pipeBox">
    <div id="map"></div>
    <div class="noneBox"></div>
    <div class="content">
      <div class="left">
        <div class="top">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">设备状态</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner">
            <div class="topLeft">
              <ul>
                <li>
                  <div>
                    <img src="../../assets/img/dp_5.png"
                      alt="">
                    <span class="title1">设备总数</span>
                  </div>
                  <span class="title2">{{this.equipmentStatus.TOTAL}}</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_1.png"
                      alt="">
                    <span class="title1">正常数</span>
                  </div>
                  <span class="title2">{{this.equipmentStatus.NORMAL}}</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_4.png"
                      alt="">
                    <span class="title1">离线数</span>
                  </div>
                  <span class="title2">{{this.equipmentStatus.offLine}}</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_2.png"
                      alt="">
                    <span class="title1">报警数</span>
                  </div>
                  <span class="title2">{{this.equipmentStatus.ABNORMAL}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="centre">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">站点统计</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner">
            <div class="innerTop"><img src="../../assets/img/dp_7.png"
                alt=""><span class="span1">站点总数:</span><span>{{this.stationTypeCount[5] ? this.stationTypeCount[5].total : 0}}</span>
            </div>
            <div class="innerBottom">
              <ul>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">水厂:</div><span>{{this.stationTypeCount[0] ? this.stationTypeCount[0].typeTotal : 0}}</span>
                  </div>
                  <div class="box">
                    <em></em>
                    <div class="box2">高位水池:</div><span>{{this.stationTypeCount[4] ? this.stationTypeCount[4].typeTotal : 0}}</span>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">泵站:</div><span>{{this.stationTypeCount[1] ? this.stationTypeCount[1].typeTotal : 0}}</span>
                  </div>
                  <div class="box">
                    <em></em>
                    <div class="box2">蓄水池:</div><span>{{this.stationTypeCount[3] ? this.stationTypeCount[3].typeTotal : 0}}</span>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">监测点:</div><span>{{this.stationTypeCount[2] ? this.stationTypeCount[2].typeTotal : 0}}</span>
                  </div>
                </li>
                <!-- <li><em></em>
                  <div>水厂:</div><span>{{this.stationTypeCount[0].typeTotal}}</span>
                </li>
                <li><em></em>
                  <div>高位水池:</div><span>{{this.stationTypeCount[4].typeTotal}}</span>
                </li>
                <li><em></em>
                  <div>泵站:</div><span>{{this.stationTypeCount[1].typeTotal}}</span>
                </li>
                <li><em></em>
                  <div>蓄水池:</div><span>{{this.stationTypeCount[3].typeTotal}}</span>
                </li>
                <li><em></em>
                  <div>监测点:</div><span>{{this.stationTypeCount[2].typeTotal}}</span>
                </li> -->
              </ul>
            </div>
          </div>
        </div>
        <div class="bottom">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">水质状态</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner">
            <ul class="ul1">
              <li class="li1"
                style="margin-bottom:1.925vw;">
                <div class="liLeft">
                  <ul>
                    <li>
                      <div><img src="../../assets/img/dp_6.png"
                          alt=""></div><span class="span1">余氯值</span>
                    </li>
                    <li class="lastLi">
                      <div class="noneImg"></div>
                      <ul>
                        <li>
                          <em class="emBg1"></em><span class="span2">正常</span><span class="span2">{{this.waterQualityList[0] ? this.waterQualityList[0].normalCount : 0}}</span>
                        </li>
                        <li>
                          <em class="emBg1"
                            style="opacity:0.7;"></em><span class="span2">报警</span><span class="span2">{{this.waterQualityList[0] ? this.waterQualityList[0].aboveThresholdCount + this.waterQualityList[0].belowThresholdCount : 0}}</span>
                        </li>
                        <li>
                          <em class="emBg1"
                            style="opacity:0.4;"></em><span class="span2">离线</span><span class="span2">{{this.waterQualityList[0] ? this.waterQualityList[0].offLine : 0}}</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="liRight">
                  <div class="box1"><span class="span2">标准：0.32~0.36mg/l</span></div>
                  <div class="box2">
                    <div class="waterEcharts"
                      id="waterEcharts1"></div>
                  </div>
                </div>
              </li>
              <li class="li1"
                style="margin-bottom:1.925vw;">
                <div class="liLeft">
                  <ul>
                    <li>
                      <div><img src="../../assets/img/dp_8.png"
                          alt=""></div><span class="span1 span3">PH值</span>
                    </li>
                    <li class="lastLi">
                      <div class="noneImg"></div>
                      <ul>
                        <li>
                          <em class="emBg2"></em><span class="span2">正常</span><span class="span2">{{this.waterQualityList[1] ? this.waterQualityList[1].normalCount : 0}}</span>
                        </li>
                        <li>
                          <em class="emBg2"
                            style="opacity:0.7;"></em><span class="span2">报警</span><span class="span2">{{this.waterQualityList[1] ? this.waterQualityList[1].aboveThresholdCount + this.waterQualityList[1].belowThresholdCount : 0}}</span>
                        </li>
                        <li>
                          <em class="emBg2"
                            style="opacity:0.4;"></em><span class="span2">离线</span><span class="span2">{{this.waterQualityList[1] ? this.waterQualityList[1].offLine : 0}}</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="liRight">
                  <div class="box1"><span class="span2 span3">标准：7.11~7.99</span></div>
                  <div class="box2">
                    <div class="waterEcharts"
                      id="waterEcharts2"></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="top">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">实时报警</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="ulBox"
            ref="ulFatherBox"
            @mouseenter="stopTime"
            @mouseleave="initpao">
            <div style="color:white;font-size:20px;text-align:center"
                v-if="alarm.length == 0">暂无数据</div>
            <ul ref="ulBox">
              <li v-for="(item, index) in alarm"
                :key="index">
                <div class="liBox"
                  v-if="item.messageType === 'ALARM'">
                  <div class="liBoxOne"><span v-for="(v, index) in alarmType"
                      :key="index"
                      v-show="item.data.type === v.name">{{item.data.location + item.data.stationName + v.val + '报警'}}</span></div>
                  <div class="liBoxTwo">
                    <span>{{item.data.location}}</span>
                    <span>{{setTimes(item.data.alarm.time)}}</span>
                  </div>
                </div>
                <div class="liBox"
                  v-if="item.messageType === 'HK_PICTURE'">
                  <div class="liBoxOne"
                    v-for="(v, index) in stationLists"
                    :key="index"
                    v-show="v.id === item.data.stationCode">{{v.location + v.name + '警戒区域报警'}}</div>
                  <div class="liBoxTwo">
                    <span>
                      <span v-for="(v, index) in stationLists"
                        :key="index"
                        v-show="v.id === item.data.stationCode">{{v.location}}</span>
                    </span>
                    <span>{{setTimes(item.data.reportingTime, 1)}}</span>
                  </div>
                </div>
              </li>
              <!-- <li>
                <div class="liBox">
                  <div class="liBoxOne">通知信息的主要内容，通知信息的主要内容。</div>
                  <div class="liBoxTwo">
                    <span>信息来源</span>
                    <span>2019-07-23 11:25:42</span>
                  </div>
                </div>
              </li> -->
            </ul>
          </div>
        </div>
        <div class="centre">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">运行分析</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner"
            id="analysisCharts"></div>
        </div>
        <div class="bottom">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">安防状态</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner">
            <div class="innerTop">
              <span>视频监控</span>
              <div class="bgWarp">
                <div class="bg"
                  id="video"></div>
              </div>
            </div>
            <div class="innerBottom">
              <div class="leftBox"><span>已安装：</span><span>{{this.waterBinding.isBinding}} / {{this.waterBinding.total}}</span></div>
              <div class="rightBox"><span>安装率：</span><span>{{this.waterBinding.percentage}}%</span></div>
            </div>
          </div>
        </div>
      </div>
      <ul class="pipeCenterTop">
        <li>
          <img src="../../assets/img/bengfangshu.png"
            alt="">
          <div>
            <span>泵房数</span>
            <p>345</p>
          </div>
        </li>
        <li>
          <img src="../../assets/img/jizushu.png"
            alt="">
          <div>
            <span>机组数</span>
            <p>450</p>
          </div>
        </li>
        <li>
          <img src="../../assets/img/tuoguanlv.png"
            alt="">
          <div>
            <span>泵房托管率</span>
            <p>60%</p>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
import borderImg from './borderImg'
import MP from '@/assets/js/AmapAndUi'
import setTime from '@/assets/js/setTime'
import red from '@/assets/img/red.gif'
import gray from '@/assets/img/gray.gif'
import yellow from '@/assets/img/yellow.gif'
import green from '@/assets/img/green.gif'
export default {
  name: 'pipe',
  data () {
    return {
      time: 0,
      map: '',
      zuobiao: [[106.05177, 35.891326], [106.474647, 36.176732], [106.20204, 36.207616], [106.104, 36.107616]],
      markerList: [],
      infoWindow: '',
      timess: null,
      equipmentStatus: {
        TOTAL: 0,
        NORMAL: 0,
        offLine: 0,
        ABNORMAL: 0
      },
      stationTypeCount: [
        {
          typeTotal: 0
        },
        {
          typeTotal: 0
        },
        {
          typeTotal: 0
        },
        {
          typeTotal: 0
        },
        {
          typeTotal: 0
        },
        {
          total: 0
        }
      ],
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
      waterBinding: {
        bindingRate: 0,
        total: 0,
        percentage: 0
      },
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
      mapObj: null,
      stationLists: [],
      station: []
    }
  },
  created () {
  },
  components: {
    borderImg
  },
  mounted () {
    this.initpao()
    this.pieCharts()
    this.initData()
  },
  beforeDestroy () {
    this.stopTime()
  },
  methods: {
    setTimes (val, num = 1000) {
      // return '123'
      return setTime({ date: val, number: num, type: 1 })
    },
    initData () {
      this.$api.product.getNowData().then(res => {
        if (res.code === 200) {
          this.station = res.data
          this.initMap()
        }
      })
      this.$api.product.getStationNoPage().then(res => {
        if (res.code === 200) {
          this.stationLists = res.data
        }
      })
      this.$api.waterSupply.getEquipmentTotalAndNormalAndAbNormalAndOffLine().then(res => {
        if (res.code === 200) {
          this.equipmentStatus = res.data
          console.log(res.data)
          console.log(this.equipmentStatus)
        }
      })
      this.$api.waterSupply.getStationTypeCount().then(res => {
        if (res.code === 200) {
          this.stationTypeCount = res.data
        }
      })
      this.$api.waterSupply.getWaterQualityList().then(res => {
        if (res.code === 200) {
          this.waterQualityList = res.data
        }
      })
      this.$api.waterSupply.getSevenDayWater().then(res => {
        if (res.code === 200) {
          this.analysisCharts(res.data.xData, res.data.yData)
        }
      })
      this.$api.waterSupply.getWaterBinding().then(res => {
        if (res.code === 200) {
          this.waterBinding = res.data
          if (this.waterBinding.total === 0) {
            this.waterBinding.percentage = 0
          } else {
            this.waterBinding.percentage = this.waterBinding.bindingRate * 100 / 1
          }
          let video = document.getElementById('video')
          video.style.width = `${this.waterBinding.percentage}%`
        }
      })
    },
    // 初始化地图
    initMap () {
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
        this.station.forEach((item, index) => {
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
              title = item.stationName
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
              title = item.stationName
              bg = '#787575'
              content = `<li style="display: flex;height: 25px;line-height: 25px;margin-bottom: 5px">
                                        <span style="margin-right: 5px;">离线时间</span>
                                        <p style="background: #4a0101;width: 160px;text-align: center">${time}</p>
                                       </li>`
              break
            case 2:
              icon = yellow
              title = item.stationName
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
              title = item.stationName
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
        })
        this.map.add(this.markerList)
      })
    },
    closeInfo () {
      this.infoWindow.close()
    },
    initpao () {
      this.timess = setInterval(() => {
        this.time--
        let top = parseFloat(this.$refs.ulBox.style.top)
        if ((top + this.$refs.ulBox.offsetHeight) <= 0) {
          this.time = this.$refs.ulFatherBox.offsetHeight
        }
        this.$refs.ulBox.style.top = `${this.time}px`
      }, 50)
    },
    stopTime () {
      window.clearInterval(this.timess)
    },
    markerClick (e) {
      if (e.target.getExtData().stationId === 3) {
        return
      }
      if (this.infoWindow.getIsOpen()) {
        this.infoWindow.close()
      } else {
        this.infoWindow.setContent(e.target.content)
        this.infoWindow.open(this.map, e.target.getPosition())
      }
    },
    pieCharts () {
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
    analysisCharts (xData, yData) {
      let charts = this.$echarts.init(document.querySelector('#analysisCharts'))
      charts.setOption({
        title: {
          text: '近7日用水量',
          // x: 'right',
          // y: 'top',
          textStyle: {
            color: '#FFFFFF',
            fontSize: 16
          },
          left: '5%',
          padding: [
            7, // 上
            0, // 右
            7, // 下
            0 // 左
          ]
        },
        grid: {
          x: '15%', // 左上角x轴距盒子边框的距离
          y: '25%', // 左上角Y轴距盒子边框的距离
          x2: '10%', // 右下角x轴距盒子边框的距离
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
  computed: {
    alarm () {
      console.log(this.$store.state.dp_alarm)
      return this.$store.state.dp_alarm
    }
  },
  watch: {
    alarm (a, b) {
    }
  }
}
</script>
<style lang="scss" scoped>
.noneBox {
  height: 30px;
  width: 100%;
  margin-top: 0.5208vw;
}
.content {
  flex: 1;
  margin-top: 0.9345vw;
  display: flex;
  position: relative;
  margin: 0.4672vw 1.25vw 0.9895vw 1.25vw;
  // margin-bottom: 0.9895vw ;
}
.pipeBox {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;

  #map {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 98;
  }

  h3 {
    color: #a6c4f2;
    font-size: 1vw;
    height: 40px;
    line-height: 40px;
  }

  .contentBox {
    display: flex;
    flex-direction: column;
    color: #cadcf9;
    font-size: 1vw;
  }

  .contentSon {
    flex: 1;
    border: 1px solid #1c6df6;
    border-radius: 5px;
    background: #081042;
    padding: 0 3%;
    position: relative;

    .light {
      position: absolute;
      left: 50%;
      top: 0;
      display: block;
      margin-left: -137px;
      margin-top: -14.5px;
      width: 274px;
      height: 29px;
    }
  }
  .pipeCenterTop {
    padding: 1%;
    width: 50%;
    height: 20%;
    box-sizing: border-box;
    position: absolute;
    left: 25%;
    top: 0;
    display: flex;

    li {
      width: 33.33%;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        display: block;
        margin-right: 15px;
      }

      div {
        span {
          color: #cadcf9;
          font-size: 0.8vw;
        }

        p {
          height: 40px;
          line-height: 40px;
          font-size: 1.4vw;
          color: #cadcf9;
        }
      }
    }
  }
}
.left {
  position: absolute;
  left: 0;
  width: 22.81%;
  height: 100%;
  // background: pink;
  display: flex;
  flex-direction: column;
  z-index: 100;
  .top {
    margin-bottom: 0.4672vw;
    height: 28.57%;
    // background: red;
    position: relative;
    border: 1px solid #4292ff;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    background: rgba(4, 26, 69, 1);
    .inner {
      margin-top: 0.8411vw;
      flex: 1;
      display: flex;
      margin-bottom: 0.8411vw;
      .topLeft {
        flex: 1;
        display: flex;
        padding-left: 1.7708vw;
        ul {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        li {
          display: flex;
          align-items: center;
          div {
            display: flex;
            align-items: center;
            width: 61.13%;
          }
          img {
            margin-right: 0.677vw;
          }
          .title1 {
            color: rgba(202, 220, 249, 1);
            font-size: 0.833vw;
            font-weight: bold;
          }
          .title2 {
            font-weight: bold;
            font-size: 1.04vw;
            color: rgba(219, 231, 250, 1);
            text-shadow: 0px 2px 4px rgba(219, 231, 250, 0.5);
          }
          // margin-bottom: 0.8629vw;
        }
      }
    }
  }
  .centre {
    margin-bottom: 0.4672vw;
    height: 27.47%;
    border: 1px solid #4292ff;
    position: relative;
    border-radius: 10px;
    background: rgba(4, 26, 69, 1);
    display: flex;
    flex-direction: column;
    .inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-bottom: 1.288vw;
      .innerTop {
        margin-top: 0.4121vw;
        font-weight: bold;
        color: rgba(202, 220, 249, 1);
        font-size: 0.9375vw;
        display: flex;
        align-items: flex-end;
        margin-left: 1.1979vw;
        margin-bottom: 1.5vw;
        img {
          margin-right: 0.3125vw;
        }
        .span1 {
          margin-right: 0.625vw;
        }
      }
      .innerBottom {
        flex: 1;
        display: flex;
        flex-direction: column;
        ul {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          justify-content: space-between;
          li {
            // width: 50%;
            // flex: 1;
            display: flex;
            // padding-left: 2.1966vw;
            padding-left: 2.9vw;
            // align-items: center;
            // font-weight: bold;
            // font-size: 0.833vw;
            // box-sizing: border-box;
            // color: rgba(202, 220, 249, 1);
            .box {
              flex: 1;
              display: flex;
              align-items: center;
              font-weight: bold;
              font-size: 0.833vw;
              box-sizing: border-box;
              color: rgba(202, 220, 249, 1);
              .box1 {
                width: 2.764vw;
              }
              .box2 {
                width: 3.5692vw;
              }
            }
            // margin-bottom: 1.6vw;
            em {
              display: block;
              width: 0.83vw;
              height: 0.3738vw;
              background: rgba(235, 69, 255, 1);
              box-shadow: 0px 2px 6px 0px rgba(235, 69, 255, 0.6);
              border-radius: 4px;
              margin-right: 0.625vw;
            }
            div {
              text-align: right;
              margin-right: 0.7291vw;
            }
          }
        }
      }
      // .innerBottom > ul > li:nth-child(odd) {
      //   padding-left: 2.1966vw;
      // }
      // .innerBottom > ul > li:nth-child(odd) > div {
      //   width: 2.864vw;
      // }
      // .innerBottom > ul > li:nth-child(even) > div {
      // }
      // .innerBottom > ul > li:last-child {
      //   margin-bottom: 0;
      // }
    }
  }
  .bottom {
    height: 43.3%;
    border: 1px solid #4292ff;
    position: relative;
    border-radius: 10px;
    background: rgba(4, 26, 69, 1);
    display: flex;
    flex-direction: column;
    .inner {
      flex: 1;
      // background: red;
      margin-top: 1.145vw;
      margin-left: 1.5625vw;
      display: flex;
      flex-direction: column;
      flex: 1;
      .ul1 {
        display: flex;
        flex-direction: column;
        flex: 1;
        .li1 {
          flex: 1;
          display: flex;
        }
      }
      .liLeft {
        width: 40%;
        // flex: 1;
        display: flex;
        // align-items: center;
        ul {
          flex: 1;
          display: flex;
          // align-items: center;
          flex-direction: column;
          li {
            display: flex;
            width: 100%;
            align-items: center;
            img {
              margin-right: 0.8854vw;
              width: 2.0833vw;
              height: 2.0833vw;
            }
            .noneImg {
              width: 2.0833vw;
              height: 2.0833vw;
            }
            .emBg1,
            .emBg2 {
              display: block;
              width: 8px;
              height: 8px;
              background: rgba(255, 174, 69, 1);
              border-radius: 50%;
              margin-right: 0.45vw;
            }
            .emBg2 {
              background: rgba(0, 215, 233, 1);
            }
            .span1 {
              font-size: 0.9375vw;
              font-weight: bold;
              color: rgba(255, 174, 69, 1);
              margin-right: 0.9895vw;
            }
            .span2 {
              font-size: 0.833vw;
              font-weight: bold;
              color: rgba(219, 231, 250, 1);
              margin-right: 0.9895vw;
            }
            .span3 {
              color: rgba(0, 215, 233, 1);
            }
          }
        }
        .lastLi {
          flex: 1;
          li {
            margin-bottom: 0.5958vw;
            // align-items: normal;
          }
        }
        .lastLi li:last-child {
          margin-bottom: 0;
        }
        // .span1 {
        //   font-size: 0.9375vw;
        //   font-weight: bold;
        //   color: rgba(255, 174, 69, 1);
        //   // margin-right: 3.3854vw;
        // }
        // .span2 {
        //   font-size: 0.9375vw;
        //   color: rgba(255, 174, 69, 1);
        // }
      }
      // .innerTop {
      //   margin-bottom: 0.458vw;

      .liRight {
        flex: 1;
        // background: pink;
        display: flex;
        flex-direction: column;
        .box1 {
          width: 100%;
          display: flex;
          justify-content: center;
          height: 2.0833vw;
          align-items: center;
        }
        .span2 {
          font-size: 0.9375vw;
          color: rgba(255, 174, 69, 1);
        }
        .span3 {
          color: rgba(0, 215, 233, 1);
        }
        .box2 {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .waterEcharts {
          width: 4.375vw;
          height: 4.375vw;
          // background: red;
          // margin-right: 4.947vw;
        }
      }
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
}
.right {
  position: absolute;
  right: 0;
  width: 22.91%;
  height: 100%;
  z-index: 100;
  .top {
    border-radius: 10px;
    background: rgba(4, 26, 69, 1);
    margin-bottom: 0.4672vw;
    height: 43.95%;
    position: relative;
    border: 1px solid #4292ff;
    display: flex;
    flex-direction: column;
    .ulBox {
      flex: 1;
      position: relative;
      overflow: hidden;
      margin-top: 1.614vw;
      margin-left: 1.5625vw;
      margin-right: 1.4583vw;

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
  .centre {
    background: rgba(4, 26, 69, 1);
    margin-bottom: 0.4672vw;
    height: 24.17%;
    position: relative;
    border: 1px solid #4292ff;
    display: flex;
    flex-direction: column;
    .inner {
      flex: 1;
      width: 100%;
    }
  }
  .bottom {
    background: rgba(4, 26, 69, 1);
    height: 17.54%;
    position: relative;
    border: 1px solid #4292ff;
    display: flex;
    flex-direction: column;
    .inner {
      flex: 1;
      // margin-top: 1.458vw;
      display: flex;
      flex-direction: column;
      margin: 1.458vw 1.979vw 0 1.822vw;
      .innerTop {
        display: flex;
        align-items: center;
        margin-bottom: 1.1vw;
        span {
          font-weight: bold;
          color: rgba(219, 231, 250, 1);
          font-size: 0.833vw;
          margin-right: 1.09375vw;
        }
        .bgWarp {
          flex: 1;
          background: rgba(38, 61, 107, 1);
          height: 0.825vw;
        }
        .bg {
          width: 60%;
          height: 100%;
          box-sizing: border-box;
          background: rgba(2, 118, 109, 1);
          border: 1px solid rgba(0, 255, 168, 1);
        }
      }
      .innerBottom {
        font-weight: 400;
        color: rgba(219, 231, 250, 1);
        font-size: 0.833vw;
        display: flex;
        justify-content: space-between;
        .leftBox {
        }
        .rightBox {
          margin-right: 1.041vw;
        }
      }
    }
  }
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  .leftImg {
  }
  .titles {
    margin: 0 0.41vw;
    color: #09aded;
    font-weight: bold;
    font-size: 0.8411vw;
    // background-image: -webkit-gradient(
    //   linear,
    //   0 0,
    //   0 bottom,
    //   from(rgba(0, 128, 0, 1)),
    //   to(rgba(51, 51, 51, 1))
    // );
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }
  .rightImg {
    transform: rotateY(180deg);
  }
}
/deep/ .amap-marker-label {
  border-color: #ccc !important;
  border-radius: 5px !important;
  font-weight: 700 !important;
}
</style>
