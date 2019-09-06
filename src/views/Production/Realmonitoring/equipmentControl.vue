<template>
    <div class="box" id="boxs">
      <p class="pupmTitle" v-show="stationList[0].one.opening">操作中...</p>
      <div class="waterOne" ref="waterOne"></div>
      <div class="waterTwo" ref="waterTwo"></div>
      <div class="oneYewei">
        <p><span>液位:</span><span :class="{error: Number(stationList[0].yeWeiParameter.maxNum) <= Number(stationList[0].yewei) || Number(stationList[0].yeWeiParameter.minNum) >= Number(stationList[0].yewei)}">{{stationList[0].yewei}} M</span></p>
      </div>
      <div class="oneDataShow">
        <p><span>压力:</span><span :class="{error: Number(stationList[0].yaLiParameter.maxNum) <= Number(stationList[0].yali) || Number(stationList[0].yaLiParameter.minNum) >= Number(stationList[0].yali)}">{{stationList[0].yali}} Pa</span></p>
      </div>
      <div class="twoYewei">
        <p><span>液位:</span><span :class="{error: Number(stationList[1].yeWeiParameter.maxNum) <= Number(stationList[1].yewei) || Number(stationList[1].yeWeiParameter.minNum) >= Number(stationList[1].yewei)}">{{stationList[1].yewei}} M</span></p>
      </div>
      <div class="twoDataShow">
        <p><span>压力:</span><span :class="{error: Number(stationList[1].yaLiParameter.maxNum) <= Number(stationList[1].yali) || Number(stationList[1].yaLiParameter.minNum) >= Number(stationList[1].yali)}">{{stationList[1].yali}} Pa</span></p>
      </div>
      <div class="threeDataShow">
        <p><span>压力:</span><span :class="{error: Number(stationList[2].yaLiParameter.maxNum) <= Number(stationList[2].yali) || Number(stationList[2].yaLiParameter.minNum) >= Number(stationList[2].yali)}">{{stationList[2].yali}} Pa</span></p>
        <p><span>流量:</span><span>{{stationList[2].liuliang}} m³/h</span></p>
      </div>
      <img class="lakes" src="../../../assets/img/lakes.png" alt="">
      <img class="pump" src="../../../assets/img/pump.png" alt="">
      <img class="heightPool" src="../../../assets/img/heightPool.png" alt="">
      <img class="savaPool" src="../../../assets/img/savePool.png" alt="">
      <img class="home" src="../../../assets/img/home.png" alt="">
      <img title="开关泵" @click="closePump" v-show="stationList[0].one.doorState !== 'ABNORMAL'"  :class="{trans : stationList[0].one.doorState}" class="fengshan" src="../../../assets/img/fengshan.png" alt="">
      <img class="paWatch one" src="../../../assets/img/paWatch.png" alt="">
      <img class="paWatch two" src="../../../assets/img/paWatch.png" alt="">
      <img class="paWatch three" src="../../../assets/img/paWatch.png" alt="">
      <img title="异常" class="open ones" src="../../../assets/img/yichang.png" v-show="stationList[0].two.doorState === 'ABNORMAL'" alt="">
      <img title="开关阀" @click="closeDoor(0, 'two')" :class="{trans : stationList[0].two.opening}" v-show="stationList[0].two.doorState !== 'ABNORMAL'" class="open ones" :src="stationList[0].two.doorImg" alt="">
      <img title="异常" class="open twos" src="../../../assets/img/yichang.png" v-show="stationList[1].one.doorState === 'ABNORMAL'" alt="">
      <img title="开关阀" @click="closeDoor(1, 'one')" :class="{trans : stationList[1].one.opening}" v-show="stationList[1].one.doorState !== 'ABNORMAL'" class="open twos" :src="stationList[1].one.doorImg" alt="">
      <img title="异常" class="open threes" src="../../../assets/img/yichang.png" v-show="stationList[1].two.doorState === 'ABNORMAL'" alt="">
      <img title="开关阀" @click="closeDoor(1, 'two')" :class="{trans : stationList[1].two.opening}" v-show="stationList[1].two.doorState !== 'ABNORMAL'" class="open threes" :src="stationList[1].two.doorImg" alt="">
      <img title="异常" class="open fours" src="../../../assets/img/yichang.png" v-show="stationList[2].one.doorState === 'ABNORMAL'" alt="">
      <img title="开关阀" @click="closeDoor(2, 'one')" :class="{trans : stationList[2].one.opening}" v-show="stationList[2].one.doorState !== 'ABNORMAL'" class="open fours" :src="stationList[2].one.doorImg" alt="">
      <img class="waterWacth" src="../../../assets/img/direct.jpg" alt="">
    </div>
</template>

<script>
import openDoor from '../../../assets/img/open.png'
import closeDoor from '../../../assets/img/close.png'
import WaterPipe from '../../../assets/js/waterPipe'
export default {
  name: 'equipmentControl',
  data () {
    return {
      parameterList: [],
      stationData: [],
      stationList: [
        {
          yeWeiParameter: {},
          yaLiParameter: {},
          id: null,
          yewei: null,
          yali: null,
          liuliang: null,
          one: {
            id: null,
            doorState: true,
            opening: false
          },
          two: {
            id: null,
            doorState: true,
            opening: false,
            doorImg: openDoor
          }
        },
        {
          yeWeiParameter: {},
          yaLiParameter: {},
          id: null,
          yewei: null,
          yali: null,
          liuliang: null,
          one: {
            id: null,
            doorState: true,
            opening: false,
            doorImg: openDoor
          },
          two: {
            id: null,
            doorState: true,
            opening: false,
            doorImg: openDoor
          }
        },
        {
          yeWeiParameter: {},
          yaLiParameter: {},
          id: null,
          yewei: null,
          yali: null,
          liuliang: null,
          one: {
            id: null,
            doorState: true,
            opening: false,
            doorImg: openDoor
          },
          two: {
            id: null,
            doorState: true,
            opening: false,
            doorImg: openDoor
          }
        }
      ],
      pipeOne: null,
      pipeTwo: null,
      pipeThree: null,
      pipeFour: null,
      timeList: [],
      timeTwoList: [],
      timeThreeList: []
    }
  },
  mounted () {
    this.initParameter()
  },
  computed: {
    facilityData () {
      return this.$store.state.facilityData
    }
  },
  beforeDestroy () {
    this.timeTwoList.forEach(item => {
      window.clearTimeout(item)
    })
    this.timeTwoList.forEach(item => {
      window.clearTimeout(item)
    })
    this.timeList.forEach(item => {
      window.clearTimeout(item)
    })
  },
  methods: {
    async initParameter () {
      let res = await this.$api.product.getParameter({ page: 1, size: 10 })
      if (res.code === 200) {
        this.parameterList = res.data.list
      } else this.$message.error('参数获取失败')
      this.initData()
    },
    initData () {
      this.$api.product.getNowData().then(res => {
        for (let i = 0; i < 3; i++) {
          switch (i) {
            case 0:
              this.stationList[0].id = res.data[i].stationId
              res.data[i].rtuVos[0].sensorDatas.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[0].two.doorState = item.value
                    break
                  case 'SWITCH02':
                    this.stationList[0].one.doorState = item.value
                    break
                  case 'LIQUID_LEVEL':
                    this.stationList[0].yewei = item.value
                    break
                  case 'PRESSURE':
                    this.stationList[0].yali = item.value
                    break
                  case 'WATER_METER':
                    this.stationList[0].liuliang = item.value
                    break
                }
              })
              res.data[i].rtuVos[0].sensors.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[0].two.id = item.id
                    break
                  case 'SWITCH02':
                    this.stationList[0].one.id = item.id
                    break
                }
              })
              this.parameterList.forEach(item => {
                if (res.data[i].rtuVos[0].rtuDeviceId === item.rtuId) {
                  switch (item.typeEnum) {
                    case 'LIQUID_LEVEL':
                      this.stationList[0].yeWeiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                      break
                    case 'PRESSURE':
                      this.stationList[0].yaLiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                  }
                }
              })
              break
            case 1:
              this.stationList[1].id = res.data[i].stationId
              res.data[i].rtuVos[0].sensorDatas.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[1].one.doorState = item.value
                    break
                  case 'SWITCH02':
                    this.stationList[1].two.doorState = item.value
                    break
                  case 'LIQUID_LEVEL':
                    this.stationList[1].yewei = item.value
                    break
                  case 'PRESSURE':
                    this.stationList[1].yali = item.value
                    break
                  case 'WATER_METER':
                    this.stationList[1].liuliang = item.value
                    break
                }
              })
              res.data[i].rtuVos[0].sensors.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[1].one.id = item.id
                    break
                  case 'SWITCH02':
                    this.stationList[1].two.id = item.id
                    break
                }
              })
              this.parameterList.forEach(item => {
                if (res.data[i].rtuVos[0].rtuDeviceId === item.rtuId) {
                  switch (item.typeEnum) {
                    case 'LIQUID_LEVEL':
                      this.stationList[1].yeWeiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                      break
                    case 'PRESSURE':
                      this.stationList[1].yaLiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                  }
                }
              })
              break
            case 2:
              this.stationList[2].id = res.data[i].stationId
              res.data[i].rtuVos[0].sensorDatas.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[2].one.doorState = item.value
                    break
                  case 'PRESSURE':
                    this.stationList[2].yali = item.value
                    break
                  case 'WATER_METER':
                    this.stationList[2].liuliang = item.value
                    break
                }
              })
              res.data[i].rtuVos[0].sensors.forEach(item => {
                switch (item.type) {
                  case 'SWITCH01':
                    this.stationList[2].one.id = item.id
                    break
                  case 'SWITCH02':
                    this.stationList[2].two.id = item.id
                    break
                }
              })
              this.parameterList.forEach(item => {
                if (res.data[i].rtuVos[0].rtuDeviceId === item.rtuId) {
                  switch (item.typeEnum) {
                    case 'LIQUID_LEVEL':
                      this.stationList[2].yeWeiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                      break
                    case 'PRESSURE':
                      this.stationList[2].yaLiParameter = { maxNum: item.maxNum, minNum: item.minNum }
                  }
                }
              })
              break
          }
        }
        this.pipeOne = new WaterPipe({
          left: '165px',
          top: '140px',
          fater: document.getElementById('boxs'),
          height: '460px',
          width: '10px',
          direction: true,
          borderLeft: '2px solid #ccc',
          borderRight: '2px solid #ccc' })
        this.pipeOne.init()
        this.pipeOneGo('animationTops')
        this.pipeTwo = new WaterPipe({
          left: '167px',
          top: '138px',
          direction: false,
          fater: document.getElementById('boxs'),
          height: '10px',
          width: '100px',
          borderTop: '2px solid #ccc',
          borderBottom: '2px solid #ccc' })
        this.pipeTwo.init()
        this.pipeThree = new WaterPipe({
          left: '420px',
          top: '280px',
          fater: document.getElementById('boxs'),
          height: '10px',
          width: '450px',
          direction: false,
          className: 'animationOneLeft',
          borderTop: '2px solid #ccc',
          borderBottom: '2px solid #ccc' })
        this.pipeThree.init()
        this.pipeFour = new WaterPipe({
          left: '990px',
          top: '410px',
          fater: document.getElementById('boxs'),
          height: '10px',
          width: '440px',
          direction: false,
          borderTop: '2px solid #ccc',
          borderBottom: '2px solid #ccc' })
        this.pipeFour.init()
        let oneHeight = 122 * this.stationList[0].yewei
        this.$refs.waterOne.style.height = oneHeight + 'px'
        let twoHeight = 117 * this.stationList[1].yewei
        this.$refs.waterTwo.style.height = twoHeight + 'px'
        if (this.stationList[0].one.doorState === 'ON') {
          this.pipeOneGo('animationTops')
        }
        if (this.stationList[0].two.doorState === 'ON' && this.stationList[1].one.doorState === 'ON') {
          this.pipeThreeGo('animationolAllOpen', 6)
        }
        if (this.stationList[0].two.doorState === 'ON' && this.stationList[1].one.doorState !== 'ON') {
          this.stationList[1].one.doorImg = closeDoor
          this.pipeThreeGo('animationolTwoOpen', 5)
        }
        if (this.stationList[0].two.doorState !== 'ON') {
          this.pipeThreeGo('animationolOneOpen', 1)
          this.stationList[0].two.doorImg = closeDoor
          if (this.stationList[1].one.doorState !== 'ON') {
            this.stationList[1].one.doorImg = closeDoor
          }
        }
        if (this.stationList[1].two.doorState === 'ON' && this.stationList[2].one.doorState === 'ON') {
          this.pipeFourGo('animationtlAllOpen', 6)
        }
        if (this.stationList[1].two.doorState === 'ON' && this.stationList[2].one.doorState !== 'ON') {
          this.stationList[2].one.doorImg = closeDoor
          this.pipeFourGo('animationtlTwoOpen', 5)
        }
        if (this.stationList[1].two.doorState !== 'ON') {
          this.stationList[1].two.doorImg = closeDoor
          if (this.stationList[2].one.doorState !== 'ON') {
            this.stationList[2].one.doorImg = closeDoor
          }
          this.pipeFourGo('animationtlOneOpen', 1)
        }
      })
    },
    closePump () {
      if (this.stationList[0].one.opening) return this.$message.error('待当前操作完成！')
      this.stationList[0].one.opening = true
      if (this.stationList[0].one.doorState) {
        setTimeout(() => {
          this.timeList.forEach(item => {
            window.clearTimeout(item)
          })
          this.timeList = []
          this.pipeOne.delWater()
          this.stationList[0].one.doorState = false
          this.stationList[0].one.opening = false
        }, 1500)
      } else {
        setTimeout(() => {
          this.stationList[0].one.doorState = true
          this.stationList[0].one.opening = false
          this.pipeOneGo('animationTops')
        }, 1500)
      }
    },
    closeDoor (i, name) {
      if (this.stationList[i][name].opening) return this.$message.error('待当前操作完成！')
      this.stationList[i][name].opening = true
      if (this.stationList[i][name].doorState === 'ON') {
        this.$api.product.turnOnOrOff({ sensorId: this.stationList[i][name].id, valve: 'OFF' }).then((res) => {
          if (res.code === 200) {
            this.$message.success('指令发送成功，待操作完成')
          } else this.$message.error('指令发送失败')
        })
      } else {
        this.$api.product.turnOnOrOff({ sensorId: this.stationList[i][name].id, valve: 'ON' }).then((res) => {
          if (res.code === 200) {
            this.$message.success('指令发送成功，待操作完成')
          } else this.$message.error('指令发送失败')
        })
      }
    },
    pipeOneGo (animationName) {
      for (let i = 0; i < 10; i++) {
        let time = setTimeout(() => {
          this.pipeOne.waterGo(animationName)
        }, 1000 * (i + 1))
        this.timeList.push(time)
      }
    },
    pipeThreeGo (animationName, num) {
      for (let i = 0; i < num; i++) {
        let time = setTimeout(() => {
          this.pipeThree.waterGo(animationName)
        }, 1000 * (i + 1))
        this.timeTwoList.push(time)
      }
    },
    pipeFourGo (animationName, num) {
      for (let i = 0; i < num; i++) {
        let time = setTimeout(() => {
          this.pipeFour.waterGo(animationName)
        }, 1000 * (i + 1))
        this.timeThreeList.push(time)
      }
    }
  },
  watch: {
    facilityData (val) {
      this.stationList.forEach((item, index) => {
        if (item.id === val.data.stationId) {
          switch (val.data.type) {
            case 'LIQUID_LEVEL':
              item.yewei = val.data.value
              if (index === 0) {
                this.$refs.waterOne.style.height = 122 * Number(val.data.value) + 'px'
              }
              if (index === 1) {
                this.$refs.waterTwo.style.height = 117 * Number(val.data.value) + 'px'
              }
              break
            case 'PRESSURE':
              item.yali = val.data.value
              break
            case 'WATER_METER':
              item.liuliang = val.data.value
              break
            case 'SWITCH01':
              if (val.data.value === 'ABNORMAL') return false
              if (index === 0) {
                this.stationList[0].two.opening = false
                this.stationList[0].two.doorState = val.data.value
                if (val.data.value === 'ON') {
                  this.stationList[0].two.doorImg = openDoor
                  this.timeTwoList = []
                  this.pipeThree.delWater()
                  if (this.stationList[1].one.doorState === 'ON') this.pipeThreeGo('animationolAllOpen', 6)
                  else this.pipeThreeGo('animationolTwoOpen', 5)
                } else {
                  this.stationList[0].two.doorImg = closeDoor
                  this.timeTwoList.forEach(item => {
                    window.clearTimeout(item)
                  })
                  this.timeTwoList = []
                  this.pipeThree.delWater()
                  this.pipeThreeGo('animationolOneOpen', 1)
                }
              }
              if (index === 1) {
                this.stationList[1].one.opening = false
                this.stationList[1].one.doorState = val.data.value
                if (val.data.value === 'ON') {
                  this.stationList[1].one.doorImg = openDoor
                  if (this.stationList[0].two.doorState === 'ON') {
                    this.timeTwoList.forEach(item => {
                      window.clearTimeout(item)
                    })
                    this.timeTwoList = []
                    this.pipeThree.delWater()
                    this.pipeThreeGo('animationolAllOpen', 6)
                  }
                } else {
                  this.stationList[1].one.doorImg = closeDoor
                  if (this.stationList[0].two.doorState === 'ON') {
                    this.timeTwoList.forEach(item => {
                      window.clearTimeout(item)
                    })
                    this.timeTwoList = []
                    this.pipeThree.delWater()
                    this.pipeThreeGo('animationolTwoOpen', 5)
                  }
                }
              }
              if (index === 2) {
                this.stationList[2].one.opening = false
                this.stationList[2].one.doorState = val.data.value
                if (val.data.value === 'ON') {
                  this.stationList[2].one.doorImg = openDoor
                  if (this.stationList[1].two.doorState === 'ON') {
                    this.timeThreeList.forEach(item => {
                      window.clearTimeout(item)
                    })
                    this.timeThreeList = []
                    this.pipeFour.delWater()
                    this.pipeFourGo('animationtlAllOpen', 6)
                  }
                } else {
                  this.stationList[2].one.doorImg = closeDoor
                  if (this.stationList[1].two.doorState === 'ON') {
                    this.timeThreeList.forEach(item => {
                      window.clearTimeout(item)
                    })
                    this.timeThreeList = []
                    this.pipeFour.delWater()
                    this.pipeFourGo('animationtlTwoOpen', 5)
                  }
                }
              }
              break
            case 'SWITCH02' :
              if (val.data.value === 'ABNORMAL') return false
              this.stationList[1].two.opening = false
              this.stationList[1].two.doorState = val.data.value
              if (val.data.value === 'ON') {
                this.stationList[1].two.doorImg = openDoor
                this.timeThreeList.forEach(item => {
                  window.clearTimeout(item)
                })
                this.timeThreeList = []
                this.pipeFour.delWater()
                if (this.stationList[2].one.doorState === 'ON') this.pipeFourGo('animationtlAllOpen', 6)
                else this.pipeFourGo('animationtlTwoOpen', 5)
              } else {
                this.stationList[1].two.doorImg = closeDoor
                this.timeThreeList.forEach(item => {
                  window.clearTimeout(item)
                })
                this.timeThreeList = []
                this.pipeFour.delWater()
                this.pipeFourGo('animationtlOneOpen', 1)
              }
              break
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    .oneYewei{
      position: absolute;
      padding: 5px 10px;
      border-radius: 4px;
      left: 262px;
      top: 84px;
      background: #2BA4FF;
      color: #ffffff;
      span:nth-child(1){
        margin-right: 5px;
      }
    }
    .twoYewei{
      position: absolute;
      padding: 5px 10px;
      border-radius: 4px;
      left: 865px;
      top: 215px;
      background: #2BA4FF;
      color: #ffffff;
      span:nth-child(1){
        margin-right: 5px;
      }
    }
    .oneDataShow{
      padding: 5px 10px;
      border-radius: 4px;
      position: absolute;
      left: 500px;
      top: 180px;
      background: #2BA4FF;
      color: #ffffff;
      span:nth-child(1){
        margin-right: 5px;
      }
    }
    .twoDataShow{
      padding: 5px 10px;
      border-radius: 4px;
      position: absolute;
      left: 1085px;
      top: 310px;
      background: #2BA4FF;
      color: #ffffff;
      span:nth-child(1){
        margin-right: 5px;
      }
    }
    .threeDataShow{
      padding: 5px 10px;
      border-radius: 4px;
      position: absolute;
      left: 1350px;
      top: 310px;
      z-index: 120;
      background: #2BA4FF;
      color: #ffffff;
      span:nth-child(1){
        margin-right: 5px;
      }
    }
    min-width: 100%;
    min-height: 850px;
    background: #fff;
    border-radius: 5px;
    position: relative;
    .waterOne{
      width: 116px;
      background: #0d8bff;
      position: absolute;
      left: 284px;
      bottom: 563px;
      z-index: 103;
    }
    .waterTwo{
      width: 75px;
      background: #0d8bff;
      position: absolute;
      left: 888px;
      bottom: 436px;
      z-index: 103;
    }
    .pupmTitle{
      border: 1px solid #ffac5b;
      position: absolute;
      top: 405px;
      left: 200px;
      background: #ffeddc;
      padding: 8px 10px;
      border-radius: 4px;
      color: #ffac5b;
      cursor: pointer;
    }
    .open{
      position: absolute;
      cursor: pointer;
      z-index: 102;
    }
    .ones{
      left: 450px;
      top: 270px;
    }
    .twos{
      left: 790px;
      top: 270px;
    }
    .threes{
      left: 1030px;
      top: 400px;
    }
    .fours{
      left: 1300px;
      top: 400px;
    }
    .lakes{
      position: absolute;
      top: 600px;
      left: 30px;
      z-index: 100;
    }
    .pump{
      position: absolute;
      top: 400px;
      left: 122px;
      transform: rotate(-90deg);
      z-index: 100;
    }
    .heightPool{
      position: absolute;
      top: 120px;
      left: 260px;
      z-index: 100;
    }
    .savaPool{
      position: absolute;
      top: 250px;
      left: 850px;
      z-index: 100;
    }
    .home {
      position: absolute;
      top: 300px;
      left: 1400px;
      z-index: 100;
    }
    .waterWacth {
      position: absolute;
      top: 500px;
      left: 1455px;
      width: 52.5px;
      height: 96px;
      z-index: 100;
    }
    .error{
      color: #c30000!important;
    }
    .fengshan {
      position: absolute;
      top: 408px;
      left: 158px;
      z-index: 101;
      cursor: pointer;
    }
    .one{
      top: 245px;
      left: 500px;
    }
    .two{
      top: 375px;
      left: 1085px;
    }
    .three{
      top: 375px;
      left: 1350px;
    }
    .paWatch{
      position: absolute;
      z-index: 102;
    }
    .trans{
      animation: rotate 1s linear infinite;   /*linear// 意思就是匀速的运动   infinite// 就是无限滚动的意思*/
    }
    @keyframes rotate{from{transform: rotate(0deg)}
      to{transform: rotate(360deg)}
    }
    /deep/.animationTops{
      animation: topLeft 10s linear infinite;
    }
    @keyframes topLeft{
      0%{
        top: 450px;
        left: 2px;
      }
      69%{
        top: 0;
        left: 2px;
        transform: rotate(0deg)
      }
      71%{
        top: -3px;
        left: 8px;
        transform: rotate(90deg)
      }
      100%{
        top: -3px;
        left: 100px;
        transform: rotate(90deg)
      }
    }
    /deep/.animationolAllOpen{
       animation: oneLeft 5s linear infinite;
     }
    @keyframes oneLeft{
      0%{
        top: 2px;
        left: 0;
      }
      100%{
        top: 2px;
        left: 450px;
      }
    }
    /deep/.animationolOneOpen{
      animation: oloOpen 1s linear infinite;
    }
    @keyframes oloOpen{
      0%{
        top: 2px;
        left: 0;
      }
      100%{
        top: 2px;
        left: 40px;
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
        left: 370px;
      }
    }
    /deep/.animationtlAllOpen{
      animation: twoLeftAll 5s linear infinite;
    }
    @keyframes twoLeftAll{
      0%{
        top: 2px;
        left: 0;
      }
      100%{
        top: 2px;
        left: 450px;
      }
    }
    /deep/.animationtlOneOpen{
      animation: twoLeftOne 1s linear infinite;
    }
    @keyframes twoLeftOne{
      0%{
        top: 2px;
        left: 0;
      }
      100%{
        top: 2px;
        left: 50px;
      }
    }
    /deep/.animationtlTwoOpen{
       animation: twoLeftTwo 3s linear infinite;
     }
    @keyframes twoLeftTwo{
      0%{
        top: 2px;
        left: 0;
      }
      100%{
        top: 2px;
        left: 300px;
      }
    }
  }
</style>
