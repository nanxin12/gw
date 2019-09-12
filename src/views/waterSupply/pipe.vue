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
                  <span class="title2">163</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_1.png"
                      alt="">
                    <span class="title1">正常数</span>
                  </div>
                  <span class="title2">157</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_4.png"
                      alt="">
                    <span class="title1">离线数</span>
                  </div>
                  <span class="title2">6</span>
                </li>
                <li>
                  <div>
                    <img src="../../assets/img/dp_2.png"
                      alt="">
                    <span class="title1">报警数</span>
                  </div>
                  <span class="title2">0</span>
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
                alt=""><span class="span1">站点总数:</span><span>{{this.stationTypeCount.G}}</span>
            </div>
            <div class="innerBottom">
              <ul>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">水厂:</div><span>{{this.stationTypeCount.A}}</span>
                  </div>
                  <div class="box">
                    <em></em>
                    <div class="box2">高位水池:</div><span>{{this.stationTypeCount.E}}</span>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">泵站:</div><span>{{this.stationTypeCount.B}}</span>
                  </div>
                  <div class="box">
                    <em></em>
                    <div class="box2">蓄水池:</div><span>{{this.stationTypeCount.D}}</span>
                  </div>
                </li>
                <li>
                  <div class="box">
                    <em></em>
                    <div class="box1">监测点:</div><span>{{this.stationTypeCount.C}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="bottom">
          <borderImg :data='true'></borderImg>
          <div class="title">
            <div class="leftImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
            <div class="titles">蓄水池液位监控</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="inner">
            <div id="aa"></div>
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
            <div class="titles">监测点</div>
            <div class="rightImg"><img src="../../assets/img/dp_3.png"
                alt=""></div>
          </div>
          <div class="ulBox"
            ref="ulFatherBox1"
            @mouseenter="stopTime1"
            @mouseleave="initpao1">
            <ul ref="ulBox1"
              style="position:absolute:top:0"
              class="ulBox1">
              <li v-for="(item, index) in monitoringPoints"
                :key="index">
                <div class="liBox">
                  <div class="liBoxOne">{{item.name + '监测点'}}</div>
                  <div class="liBoxTwo">
                    <span>{{'压力：' + item.pressure}} <span style="padding-left:25px;">流量：</span> </span>
                    <span>{{item.time}}</span>
                    <!-- <span>{{this.rightTime}}</span> -->
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="centre">
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
        </div> -->
        <!-- <div class="bottom">
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
        </div> -->
      </div>
    </div>

  </div>
</template>
<script>
import imgs from '@/assets/img/liua.png'
import borderImg from './borderImg'
import MP from '@/assets/js/AmapAndUi'
import setTime from '@/assets/js/setTime'
// import log from '@/assets/img/dp_mapImg.png'
import gray from '@/assets/img/gray.gif'
import yellow from '@/assets/img/yellow.gif'
import green from '@/assets/img/green.gif'
export default {
  name: 'pipe',
  data () {
    return {
      rightTime: '1236',
      monitoringPoints: [
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '三营镇',
          pressure: '0.28 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '头营镇',
          pressure: '0.32 Mpa',
          level: '4m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '张易镇',
          pressure: '0.29 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '开城镇',
          pressure: '0.3 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '河川乡',
          pressure: '0.28 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '寨科乡',
          pressure: '0.27 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '炭山乡',
          pressure: '0.31 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '中河乡',
          pressure: '0.34 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '彭堡镇',
          pressure: '0.35 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '官厅镇',
          pressure: '0.31 Mpa',
          level: '6m',
          time: this.rightTime
        },
        {
          // 三营镇 头营镇 张易镇 开城镇 河川乡 寨科乡 炭山乡 中河乡 彭堡镇 官厅镇 黄铎堡镇
          name: '黄铎堡镇',
          pressure: '0.33 Mpa',
          level: '6m',
          time: this.rightTime
        }
      ],
      time: 0,
      time1: 0,
      map: '',
      zuobiao: [],
      markerList: [],
      markerLists: [],
      infoWindow: '',
      timess: null,
      timess1: null,
      equipmentStatus: {
        TOTAL: 0,
        NORMAL: 0,
        offLine: 0,
        ABNORMAL: 0
      },
      stationTypeCount: {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        G: 0
      },
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
    let times = new Date().getTime()
    let time = setTime({ date: times, number: 1, type: 1 })
    this.rightTime = time
    this.monitoringPoints.forEach(v => {
      v.time = this.rightTime
    })
  },
  components: {
    borderImg
  },
  mounted () {
    this.initpao()
    this.initpao1()
    this.initData()
    this.initLeft()
  },
  beforeDestroy () {
    this.stopTime()
  },
  methods: {
    initLeft (key, value) {
      let charts = this.$echarts.init(document.querySelector('#aa'))
      charts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          textStyle: { color: '#fff' },
          data: ['蓄水池'],
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
              fontSize: 12,
              interval: 0,
              rotate: 30
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
            name: '蓄水池',
            type: 'bar',
            stack: '广告',
            data: [3.2, 3.3, 3.0, 3.3, 3.9, 3.3, 3.2, 2.7, 3.1, 3.3, 2.8],
            itemStyle: {
              color: '#ff792c'
            },
            barWidth: '15PX'
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
      window.addEventListener('resize', function () {
        charts.resize()
      })
    },
    setTimes (val, num = 1000) {
      // return '123'
      return setTime({ date: val, number: num, type: 1 })
    },
    initData () {
      this.$api.product.getNowData().then(res => {
        if (res.code === 200) {
          this.station = res.data
        }
      })
      this.$api.product.getStationNoPage().then(res => {
        if (res.code === 200) {
          this.stationLists = res.data
          this.initMap()
        }
      })
      this.$api.waterSupply.getEquipmentTotalAndNormalAndAbNormalAndOffLine().then(res => {
        if (res.code === 200) {
          this.equipmentStatus = res.data
        }
      })
      this.$api.waterSupply.getStationTypeCount().then(res => {
        if (res.code === 200) {
          this.stationTypeCount.A = res.data.A ? res.data.A : 0
          this.stationTypeCount.B = res.data.B ? res.data.B : 0
          this.stationTypeCount.C = res.data.C ? res.data.C : 0
          this.stationTypeCount.D = res.data.D ? res.data.D : 0
          this.stationTypeCount.E = res.data.E ? res.data.E : 0
          this.stationTypeCount.G = res.data.G ? res.data.G : 0
        }
      })
      this.$api.waterSupply.getWaterQualityList().then(res => {
        if (res.code === 200) {
          this.waterQualityList = res.data
        }
      })
      this.$api.waterSupply.getSevenDayWater().then(res => {
        if (res.code === 200) {
          // this.analysisCharts(res.data.xData, res.data.yData)
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
    initMap () {
      MP().then(data => {
        this.mapobj = data[0]
        window.initAMapUI()
        this.map = new this.mapobj.Map('map', {
          mapStyle: 'amap://styles/darkblue',
          zoom: 10,
          center: [106.28, 36.14]
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
        this.infoWindow = new this.mapobj.InfoWindow({
          offset: new this.mapobj.Pixel(0, -55),
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
          let times = new Date().getTime()
          let time = setTime({ date: times, number: 1, type: 1 })
          this.rightTime = time
          this.stationLists.forEach((item, index) => {
            if (item.typeId === '4028fc876cad69f6016cad768bff0014' || item.typeId === '4028fc876cad69f6016cad763e030013') {
              let arr = []
              arr.push(item.lng)
              arr.push(item.lat)
              let icon = null
              let title = null
              let content = null
              let bg = null
              switch (index) {
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
              let marker = new this.mapobj.Marker({
                position: arr,
                icon: icon,
                extData: { stationId: index },
                offset: new this.mapobj.Pixel(-40, -80)
              })
              let a = title.length
              let num = 37 - (a * 6)
              marker.setLabel({
                offset: new this.mapobj.Pixel(num, -5),
                content: '<div class=\'info\'>' + title + '</div>'
              })
              marker.content = `<div style="color: #fff;border: 1px solid ${bg};background:${bg};padding: 10px;border-radius: 5px">
                                        <h3 style="font-weight: 700;font-size: 16px;margin-bottom: 10px;">${title}</h3>
                                        <ul>${content}</ul>
                                    </div>`
              marker.on('click', this.markerClick)
              this.markerLists.push(marker)
            }
          })
          this.map.add(this.markerLists)
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
              // this.zuobiao.forEach((item, index) => {
              //   let marker = new this.mapobj.Marker({
              //     position: item,
              //     icon: log,
              //     extData: { stationId: index },
              //     offset: new this.mapobj.Pixel(-13, -30)
              //   })
              //   let title = res.data[index].name
              //   marker.setLabel({
              //     offset: new this.mapobj.Pixel(0, -28),
              //     content: '<div class=\'info\'>' + title + '</div>',
              //     direction: 'center' // 设置文本标注方位
              //   })
              //   marker.on('click', this.openWindows)
              //   this.markerList.push(marker)
              //   this.map.add(this.markerList)
              // })
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
    initpao1 () {
      this.timess1 = setInterval(() => {
        this.time1--
        let top = parseFloat(this.$refs.ulBox1.style.top)
        if ((top + this.$refs.ulBox1.offsetHeight) <= 0) {
          this.time1 = this.$refs.ulFatherBox1.offsetHeight
        }
        this.$refs.ulBox1.style.top = `${this.time1}px`
      }, 50)
    },
    stopTime () {
      window.clearInterval(this.timess)
    },
    stopTime1 () {
      window.clearInterval(this.timess1)
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
      // margin-top: 1.145vw;
      // margin-left: 1.5625vw;
      display: flex;
      flex-direction: column;
      flex: 1;
      #aa {
        height: 100%;
        width: 100%;
      }
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
      top: 0;
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
    height: 43.17%;
    // height: 24.17%;
    position: relative;
    border: 1px solid #4292ff;
    display: flex;
    flex-direction: column;
    .ulBox {
      flex: 1;
      position: relative;
      top: 0;
      overflow: hidden;
      margin-top: 1.614vw;
      margin-left: 1.5625vw;
      margin-right: 1.4583vw;
      .ulBox1 {
        position: absolute;
        top: 0;
      }
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
    // color: #09aded;
    font-weight: bold;
    font-size: 0.8411vw;
    background-image:-webkit-linear-gradient(bottom,#09ADED,#07EBFF,#07EBFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color:transparent;
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
