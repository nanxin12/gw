<template>
    <div class="box">
      <div id="map"></div>
      <div class="operationBox">
        <div class="obTop">
          <p>
            <span></span>
            <span>正常</span>
          </p>
          <p>
            <span></span>
            <span>报警</span>
          </p>
          <p>
            <span></span>
            <span>离线</span>
          </p>
        </div>
        <el-form :model="operationForm" label-position="top">
          <el-form-item label="展示数据:" style="padding-left: 5px;box-sizing: border-box;">
            <el-radio-group v-model="operationForm.dataType" @change="equipmentChange">
              <el-radio style="width: 67.5px;margin-bottom: 20px;" v-for="item in monitorType" :label="item.value" :key="item.name">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="borderBox"></div>
          <el-form-item label="站点类型:" style="padding-left: 5px;box-sizing: border-box;">
            <el-radio-group v-model="operationForm.stationType" @change="stationChange">
              <el-radio style="width: 67.5px;margin-bottom: 20px;" v-for="item in stationType" :label="item.typeEnum" :key="item.id">{{item.typeName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="equipmentBox" v-show="digShow">
        <div class="ebTitle">
          <p>{{nowEquipment.stationName}}</p>
          <i class="el-icon-close" @click="closeDig"></i>
        </div>
        <div class="ebContent"></div>
      </div>
    </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'
export default {
  name: 'index',
  data () {
    return {
      mapobj: null,
      map: null,
      nowEquipment: {},
      forInitData: null,
      textDomList: [],
      markerDomList: [],
      monitorType: [
        { name: '液位', value: 'LIQUID_LEVEL' },
        { name: '压力', value: 'PRESSURE' },
        { name: '余氯', value: 'BALANCE_OF_CL' },
        { name: 'PH值', value: 'PH' },
        { name: '电压', value: 'VOLTAGE' },
        { name: '瞬时流量', value: 'WATER_METER' }
      ],
      stationType: [],
      operationForm: {
        dataType: 'LIQUID_LEVEL',
        stationType: 'all'
      }
    }
  },
  mounted () {
    this.initMap()
    this.initTypeData()
    this.forInitData = setInterval(() => {
      this.initData().then(() => {
        this.stationChange(this.operationForm.stationType)
      })
    }, 180000)
  },
  beforeDestroy () {
    window.clearInterval(this.forInitData)
    this.closeDig()
  },
  computed: {
    digShow () {
      return this.$store.state.digShow
    }
  },
  methods: {
    closeDig () {
      this.$store.commit('changeDigShow', false)
    },
    equipmentChange (val) {
      this.textDomList.forEach(item => {
        let arr = item.getExtData().equipment
        let data = ''
        arr.forEach(items => {
          items.sensorDatas.forEach(itemss => {
            if (val === itemss.type) {
              data += ` | ${itemss.value}`
            }
          })
        })
        item.setText(data)
      })
    },
    stationChange (val) {
      let typeName = this.stationType.find(item => item.typeEnum === val).typeName
      for (let i = 0; i < this.textDomList.length; i++) {
        this.textDomList[i].show()
        this.markerDomList[i].show()
        if (typeName !== '全部') {
          if (this.markerDomList[i].getExtData().typeName !== typeName) {
            this.markerDomList[i].hide()
            this.textDomList[i].hide()
          }
        }
      }
    },
    initMap () {
      Amap().then(data => {
        this.mapobj = data[0]
        this.map = new this.mapobj.Map('map', {
          zoom: 10,
          center: [106.28, 36.14],
          doubleClickZoom: false,
          layers: [new this.mapobj.TileLayer.Satellite()]
        })
        this.map.plugin(['AMap.DistrictSearch', 'AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.PolyEditor'], () => {
          this.map.addControl(new this.mapobj.ToolBar({}))
          this.map.addControl(new this.mapobj.Scale({}))
          this.map.addControl(new this.mapobj.MapType({
            defaultType: 0
          }))
          new this.mapobj.DistrictSearch({
            extensions: 'all',
            subdistrict: 0,
            level: 'district'
          }).search('原州区', (status, result) => {
            // 外多边形坐标数组和内多边形坐标数组
            let outer = [
              new this.mapobj.LngLat(-360, 90, true),
              new this.mapobj.LngLat(-360, -90, true),
              new this.mapobj.LngLat(360, -90, true),
              new this.mapobj.LngLat(360, 90, true)
            ]
            let holes = result.districtList[0].boundaries
            let pathArray = [outer]
            pathArray.push.apply(pathArray, holes)
            let polygon = new this.mapobj.Polygon({
              pathL: pathArray,
              strokeColor: '#86c8f8',
              strokeWeight: 5,
              fillColor: '#000',
              fillOpacity: 0.7
            })
            polygon.setPath(pathArray)
            this.map.add(polygon)
            this.initPipe()
            this.initData()
          })
        })
      }, () => this.$message.error('地图加载失败请刷新页面'))
    },
    async initPipe () {
      // 获取管网
      let res = await this.$api.product.getPipeData()
      if (res.code === 200) {
        let arr = []
        res.data.forEach(item => {
          let pipe = new this.mapobj.Polyline({
            path: JSON.parse(item.coordinatePoint),
            isOutline: true,
            outlineColor: '#0a0ca9',
            borderWeight: 1,
            strokeColor: '#67c23a',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            bubble: true
          })
          arr.push(pipe)
        })
        this.map.add(arr)
      } else this.$message.error('数据获取失败')
    },
    async initData () {
      let res = await this.$api.product.getNowData()
      if (res.code === 200) {
        if (this.markerDomList.length) {
          this.map.remove(this.markerDomList)
          this.map.remove(this.textDomList)
          this.markerDomList = []
          this.textDomList = []
        }
        res.data.forEach(item => {
          let { stationName, typeName } = item
          let data = ''
          let bgColor = '#4292FF'
          let contents = ''
          let ifs = true
          if (!item.rtuVos.length) {
            contents = `<div>
                                <div style="color: #7d7d7d;font-size: 14px;font-weight:700;text-shadow:1px 1px 0 #fff,1px 2px 2px rgba(157,157,157,1);">${item.stationName}</div>
                            </div>`
          }
          item.rtuVos.forEach(items => {
            items.sensorDatas.forEach(itemss => {
              if (this.operationForm.dataType === itemss.type) {
                data += ` | ${itemss.value}`
                if (itemss.state === 'ABNORMAL') bgColor = '#FF3841'
              }
            })
            if (ifs) {
              if (items.state === 'OFFLINE' || items.state === 'NEVER_CONNECTED') {
                ifs = false
                contents = `<div>
                                <div style="color: #7d7d7d;font-size: 14px;font-weight:700;text-shadow:1px 1px 0 #fff,1px 2px 2px rgba(157,157,157,1);">${item.stationName}</div>
                            </div>`
              } else {
                contents = `<div>
                                <div style="color: #006CFF;font-size: 14px;font-weight:700;text-shadow:1px 1px 0 #fff,1px 2px 2px rgba(157,157,157,1);">${item.stationName}</div>
                            </div>`
              }
            }
          })
          let marker = new this.mapobj.Marker({
            position: [Number(item.lng), Number(item.lat)],
            icon: item.images,
            offset: new this.mapobj.Pixel(-16, -16.5),
            cursor: 'pointer',
            extData: { stationName, typeName, equipment: item.rtuVos }
          })
          marker.setLabel({
            offset: new this.mapobj.Pixel(-4, 28),
            content: contents
          })
          let text = new this.mapobj.Text({
            text: data,
            anchor: 'middle-left',
            position: [Number(item.lng), Number(item.lat)],
            offset: new this.mapobj.Pixel(-16, 0),
            zIndex: 99,
            style: {
              'height': '24px',
              'background': bgColor,
              'border': '2px solid #fff',
              'box-shadow': '1px 2px 2px 0 #9D9D9D',
              'border-radius': '14px',
              'padding': '0 13px 0 32px',
              'color': '#fff',
              'line-height': '24px'
            },
            extData: { typeName, equipment: item.rtuVos }
          })
          marker.on('click', this.equipmentCperation)
          this.textDomList.push(text)
          this.markerDomList.push(marker)
        })
        this.map.add(this.markerDomList)
        this.map.add(this.textDomList)
      }
    },
    equipmentCperation (e) {
      this.$store.commit('changeDigShow', true)
      this.nowEquipment = e.target.getExtData()
    },
    async initTypeData () {
      let res = await this.$api.product.getStationType()
      if (res.code === 200) {
        this.stationType = res.data
        this.stationType.unshift({ typeEnum: 'all', typeName: '全部' })
      } else this.$message.error('数据获取失败')
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    position: relative;
    border: 12px solid #fff;
    box-sizing: border-box;
    #map{
      width: 100%;
      height: 100%;
    }
    .operationBox{
      position: absolute;
      right: 0;
      top: 50%;
      background: #fff;
      width: 230px;
      height: 426px;
      margin-top: -213px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.12);
      border-radius: 10px;
      padding: 0 15px;
      box-sizing: border-box;
      .obTop{
        width: 100%;
        height: 63px;
        border-bottom: 1px solid #f7f7f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p{
          display: flex;
          align-items: center;
          span:nth-child(1){
            display: inline-block;
            width:10px;
            height:6px;
            margin: 0 6px;
            border-radius:3px;
          }
        }
        p:nth-child(1){
          span:nth-child(1){
            background: #4292FF;
          }
        }
        p:nth-child(2){
          span:nth-child(1){
            background: #FF3841;
          }
        }
        p:nth-child(3){
          span:nth-child(1){
            background: #7D7D7D;
          }
        }
      }
      .borderBox{
        width: 100%;
        height: 1px;
        background: #f7f7f7;
      }
    }
    .equipmentBox{
      position: absolute;
      left: 50%;
      top: 38px;
      width: 1220px;
      height: 702px;
      margin-left: -650px;
      background: #fff;
      z-index: 999;
      padding: 0 40px;
      border-radius: 10px;
      .ebTitle{
        width: 100%;
        height: 66px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p{
          color: #4292FF;
          font-size: 16px;
          font-weight: 700;
        }
        i{
          font-size: 22px;
          cursor: pointer;
        }
      }
      .ebContent{
        height: 594px;
        width: 1218px;
        border: 1px solid #4292FF;
      }
    }
  }
  /deep/ .amap-marker-label{
    border-color: transparent!important;
    background: transparent!important;
  }
  /deep/ .amap-icon {
    z-index: 3!important;
  }
</style>
