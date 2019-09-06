<template>
  <div class="box">
    <ul class="stationBox">
      <li v-for="(item, index) in townList" :class="{bgs: index === checked}" :key="item.id">
        <p @click="changeTown(index, item.code)">{{item.positionName}}</p>
      </li>
    </ul>
    <div class="mapBox">
      <div id="map"></div>
    </div>
    <div class="equipmentBox" v-show="state">
      <div class="ebTitle">
        <p>{{stationName}}</p>
        <i class="el-icon-close" @click="closeDig"></i>
      </div>
      <div class="ebContent">
        <div id="ecBox">
          <div class="waterData">
            <span>液位:</span>
            <span>2.{{num - 1}} M</span>
          </div>
          <div class="wacthData">
            <p>
              <span>压力:</span>
              <span>0.2{{num}} Mpa</span>
            </p>
            <p>
              <span>流量:</span>
              <span>2{{num}} m³/h</span>
            </p>
          </div>
          <div class="wacthDataTwo">
            <p>
              <span>压力:</span>
              <span>0.2{{num}} Mpa</span>
            </p>
            <p>
              <span>流量:</span>
              <span>2{{num}} m³/h</span>
            </p>
          </div>
          <img class="oneOpen" @click="closeDoor(0)" :src="doorList[0].img" alt="" :class="{trans : doorList[0].opening}">
          <img class="twoOpen" @click="closeDoor(1)" :src="doorList[1].img" alt="" :class="{trans : doorList[1].opening}">
          <img class="threeOpen" @click="closeDoor(2)" :src="doorList[2].img" alt="" :class="{trans : doorList[2].opening}">
          <div class="waters"></div>
          <img class="savaPool" src="../../../assets/img/savePool.png" alt="">
          <img class="home" src="../../../assets/img/home.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'
import openDoor from '../../../assets/img/open.png'
import closeDoor from '../../../assets/img/close.png'
import WaterPipe from '../../../assets/js/waterPipe'
export default {
  name: 'twoWaterSupply',
  data () {
    return {
      num: null,
      townCode: null,
      mapobj: null,
      map: null,
      townList: [],
      imgList: [],
      checked: 0,
      markerList: [],
      waterPipeOne: null,
      waterPipeTwo: null,
      doorList: [
        {
          doorState: true,
          opening: false,
          img: openDoor
        },
        {
          doorState: true,
          opening: false,
          img: openDoor
        },
        {
          doorState: true,
          opening: false,
          img: openDoor
        }
      ],
      timeOneList: [],
      timeTwoList: []
    }
  },
  mounted () {
    this.initTown()
  },
  methods: {
    closeDoor (i) {
      if (this.doorList[i].opening) return this.$message.error('待当前操作完成！')
      this.doorList[i].opening = true
      if (this.doorList[i].doorState) {
        setTimeout(() => {
          this.doorList[i].doorState = false
          this.doorList[i].opening = false
          this.doorList[i].img = closeDoor
          switch (i) {
            case 0:
              this.timeOneList.forEach(item => {
                window.clearTimeout(item)
              })
              this.timeOneList = []
              this.waterPipeOne.delWater()
              this.pipeOneGo('animationolOneClose', 1)
              break
            case 1:
              this.timeTwoList.forEach(item => {
                window.clearTimeout(item)
              })
              this.timeTwoList = []
              this.waterPipeTwo.delWater()
              this.pipeTwoGo('animationolTwoClose', 1)
              break
            case 2:
              if (this.doorList[1].doorState) {
                this.timeTwoList.forEach(item => {
                  window.clearTimeout(item)
                })
                this.timeTwoList = []
                this.waterPipeTwo.delWater()
                this.pipeTwoGo('animationolThreeCloseTwoOpen', 5)
              }
              break
          }
        }, 1500)
      } else {
        setTimeout(() => {
          this.doorList[i].doorState = true
          this.doorList[i].opening = false
          this.doorList[i].img = openDoor
          switch (i) {
            case 0:
              this.timeOneList.forEach(item => {
                window.clearTimeout(item)
              })
              this.timeOneList = []
              this.waterPipeOne.delWater()
              this.pipeOneGo('animationolOneOpen', 3)
              break
            case 1:
              this.timeTwoList.forEach(item => {
                window.clearTimeout(item)
              })
              this.timeTwoList = []
              this.waterPipeTwo.delWater()
              if (this.doorList[2].doorState) this.pipeTwoGo('animationolTwoOpen', 6)
              else this.pipeTwoGo('animationolThreeCloseTwoOpen', 5)
              break
            case 2:
              if (this.doorList[1].doorState) {
                this.timeTwoList.forEach(item => {
                  window.clearTimeout(item)
                })
                this.timeTwoList = []
                this.waterPipeTwo.delWater()
                this.pipeTwoGo('animationolTwoOpen', 6)
              }
              break
          }
        }, 1500)
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
            this.initStation()
          })
        })
      }, () => this.$message.error('地图加载失败请刷新页面'))
    },
    async initTown () {
      let res = await this.$api.organizeList.getRegionByCode({ code: 640402000000 })
      if (res.code === 200) {
        this.townList = res.data
        this.townCode = this.townList[0].code
        this.initMap()
      } else this.$message.error('区域获取失败')
    },
    markerClick (e) {
      this.$store.commit('changeDigShow', true)
      this.stationName = e.target.getExtData().name
      this.waterPipeOne = new WaterPipe({
        left: '180px',
        top: '160px',
        fater: document.getElementById('ecBox'),
        height: '10px',
        width: '100px',
        direction: false,
        borderTop: '2px solid #ccc',
        borderBottom: '2px solid #ccc'
      })
      this.waterPipeOne.init()
      this.pipeOneGo('animationolOneOpen', 3)
      this.waterPipeTwo = new WaterPipe({
        left: '425px',
        top: '270px',
        fater: document.getElementById('ecBox'),
        height: '10px',
        width: '450px',
        direction: false,
        borderTop: '2px solid #ccc',
        borderBottom: '2px solid #ccc'
      })
      this.waterPipeTwo.init()
      this.pipeTwoGo('animationolTwoOpen', 6)
      this.num = parseInt(Math.random() * 10)
    },
    closeDig () {
      this.$store.commit('changeDigShow', false)
    },
    initStation () {
      this.$api.product.getStationPage({ townId: this.townCode, page: 1, size: 20 }).then(res => {
        if (res.code === 200) {
          if (this.markerList.length) {
            this.map.remove(this.markerList)
            this.markerList = []
          }
          if (!res.data.list.length) this.$message.error('该区域未绑定站点')
          res.data.list.forEach(item => {
            console.log(item)
            if (item.typeName === '蓄水池') {
              let marker = new this.mapobj.Marker({
                position: [Number(item.lng), Number(item.lat)],
                icon: item.images,
                offset: new this.mapobj.Pixel(-16, -16.5),
                cursor: 'pointer',
                extData: { name: item.name }
              })
              marker.setLabel({
                offset: new this.mapobj.Pixel(0, -28),
                content: `<div class='info'>${item.name}</div>`,
                direction: 'center' // 设置文本标注方位
              })
              marker.on('click', this.markerClick)
              this.markerList.push(marker)
            }
          })
          this.map.add(this.markerList)
        } else this.$message.error('站点获取失败')
      })
    },
    changeTown (i, code) {
      this.checked = i
      this.townCode = code
      this.initStation()
    },
    pipeOneGo (animationName, num) {
      for (let i = 0; i < num; i++) {
        let time = setTimeout(() => {
          this.waterPipeOne.waterGo(animationName)
        }, 1000 * (i + 1))
        this.timeOneList.push(time)
      }
    },
    pipeTwoGo (animationName, num) {
      for (let i = 0; i < num; i++) {
        let time = setTimeout(() => {
          this.waterPipeTwo.waterGo(animationName)
        }, 1000 * (i + 1))
        this.timeTwoList.push(time)
      }
    }
  },
  computed: {
    state () {
      return this.$store.state.digShow
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    .stationBox{
      width: 280px;
      height: 100%;
      border: 1px solid #ccc;
      overflow-y: auto;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px 20px 0 0;
      li{
        width: 100%;
        height: 40px;
        text-indent: 20px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        border-left: 2px solid transparent;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .bgs{
        border-color: #4292FF!important;
      }
    }
    .mapBox{
      flex: 1;
      box-sizing: border-box;
      padding-left: 20px;
      #map{
        width: 100%;
        height: 100%;
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
        #ecBox{
          position: relative;
        }
        .savaPool{
          position: absolute;
          left: 280px;
          top: 130px;
          z-index: 99;
        }
        .home{
          position: absolute;
          left: 790px;
          top: 160px;
          z-index: 99;
        }
        .oneOpen{
          position: absolute;
          left: 220px;
          top: 150px;
          z-index: 99;
        }
        .twoOpen{
          position: absolute;
          left: 490px;
          top: 260px;
          z-index: 99;
        }
        .threeOpen{
          position: absolute;
          left: 710px;
          top: 260px;
          z-index: 99;
        }
        .waters{
          position: absolute;
          width: 77px;
          height: 73.5px;
          background: #4292FF;
          left: 317px;
          bottom: -296px;
          z-index: 101;
        }
        .waterData{
          background: #0d8bff;
          position: absolute;
          left: 295px;
          top: 90px;
          z-index: 103;
          padding: 5px;
          border-radius: 5px;
          color: #fff;
          span:nth-child(1){
            margin-right: 5px;
          }
        }
        .wacthData{
          background: #0d8bff;
          position: absolute;
          left: 470px;
          top: 180px;
          z-index: 103;
          padding: 5px;
          border-radius: 5px;
          color: #fff;
          span:nth-child(1){
            margin-right: 5px;
          }
        }
        .wacthDataTwo{
          background: #0d8bff;
          position: absolute;
          left: 690px;
          top: 180px;
          z-index: 103;
          padding: 5px;
          border-radius: 5px;
          color: #fff;
          span:nth-child(1){
            margin-right: 5px;
          }
        }
      }
    }
  }
  .trans{
    animation: rotate 1s linear infinite;   /*linear// 意思就是匀速的运动   infinite// 就是无限滚动的意思*/
  }
  @keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
  }
  /deep/ .amap-marker-label{
    border-color: #ccc!important;
    border-radius: 5px!important;
    font-weight: 700!important;
  }
  /deep/.animationolOneOpen{
    animation: oloOpen 2s linear infinite;
  }
  @keyframes oloOpen{
    0%{
      top: 2px;
      left: 0;
    }
    100%{
      top: 2px;
      left: 100px;
    }
  }
  /deep/.animationolTwoOpen{
    animation: oltOpen 5s linear infinite;
  }
  @keyframes oltOpen{
    0%{
      top: 2px;
      left: 0;
    }
    100%{
      top: 2px;
      left: 450px;
    }
  }
  /deep/.animationolOneClose{
     animation: oloClose 1s linear infinite;
   }
  @keyframes oloClose{
    0%{
      top: 2px;
      left: 0;
    }
    100%{
      top: 2px;
      left: 30px;
    }
  }
  /deep/.animationolTwoClose{
     animation: oltClose 1s linear infinite;
   }
  @keyframes oltClose{
    0%{
      top: 2px;
      left: 0;
    }
    100%{
      top: 2px;
      left: 60px;
    }
  }
  /deep/.animationolThreeCloseTwoOpen{
     animation: olthClose 5s linear infinite;
   }
  @keyframes olthClose{
    0%{
      top: 2px;
      left: 0;
    }
    100%{
      top: 2px;
      left: 300px;
    }
  }
</style>
