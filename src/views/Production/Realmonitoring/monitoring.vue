<template>
  <div class="monitoring">
    <div class="treeBox">
      <div style="font-size:18px;font-weight:bold;margin-bottom:18px;margin-left:11px;">监控列表</div>
      <ul>
        <li v-for="(item, index) in tableData"
          :class="{clickLi:leftIndex === index}"
          :key="index"
          @click="checkMovies(item, index)">
          <span style="margin-left:10px;">{{item.cameraName}}</span>
          <!-- <img src="@/assets/img/baojing1.gif"
            alt=""> -->
        </li>
      </ul>
    </div>
    <div class="rightBox">
      <div class="videoBox">
        <div>
          <p style="font-size:16px;margin-left:15px;margin-top:12px;margin-bottom:15px;">{{cameraInfo.name}}-{{cameraInfo.cameraName}}</p>
          <div style="margin-left:15px;margin-bottom:12px;display:flex;">
            <div>
              <span style="margin-right:17px">开始时间</span>
              <el-date-picker v-model="startTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div style="margin-left:30px">
              <span style="margin-right:17px">结束时间</span>
              <el-date-picker v-model="endTime"
                type="date"
                value-format="timestamp"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <el-button type="primary"
              style="margin-left:10px;"
              @click="handleQuery">查询</el-button>
            <el-button type="primary"
              style="margin-left:10px;"
              @click="handleInit">重置</el-button>
            <el-button type="primary"
              @click="handleSnap">手动抓拍</el-button>
          </div>
        </div>
        <div class="rightBottom">
          <div style="width:100%;display:flex;justify-content:center;padding-top:200px;"
            v-if="state === 1 && imgListOne.length === 0">
            <img src="@/assets/img/noneImg.png"
              style="margin-left:20px;width:244px;height:226px"
              alt="">
          </div>
          <div style="width:100%;display:flex;justify-content:center;padding-top:200px;"
            v-if="state === 2 && imgListTwo.length === 0">
            <img src="@/assets/img/noneImg.png"
              style="margin-left:20px;width:244px;height:226px"
              alt="">
          </div>
          <el-scrollbar ref="scrollbar"
            id="scrollbar"
            v-if="aa">
            <ul v-if="state === 1">
              <li v-for="(item, index) in imgListOne"
                :key="index">
                <div class="imgs">
                  <div class="demo-image__preview">
                    <el-image style="width: 100%; height: 100%"
                      @click="handleImg(item.cameraAbsolutelyUrl)"
                      :src="item.cameraAbsolutelyUrl"
                      :preview-src-list="srcList">
                      <div slot="error"
                        class="image-slot"
                        style="width:100%;height:100%;position:relative;">
                        <img src="@/assets/img/Img404.png"
                          alt=""
                          style="width:100%;height:100%">
                        <p style="font-size:14px;color:#c0c4cc;position:absolute;width:100%;top:66%;display:flex; justify-content: center;">网络开小差</p>
                      </div>
                    </el-image>
                  </div>
                  <img src="@/assets/img/newImg.png"
                    v-if="index === 0"
                    alt=""
                    style="position:absolute;right:14px;top:0px;">
                </div>
                <p style="font-size:14px;margin-left:4px;display:flex;justify-content:space-between;">{{item.reportingTime}}</p>
              </li>
              <!-- <img src="@/assets/img/noneImg.png"
                v-if="imgListOne.length === 0"
                alt=""> -->
            </ul>
            <ul v-if="state === 2">
              <li v-for="(item, index) in imgListTwo"
                :key="index">
                <div class="imgs">
                  <div class="demo-image__preview">
                    <el-image style="width: 100%; height: 100%"
                      @click="handleImg(item.picUrl)"
                      :src="item.picUrl"
                      :preview-src-list="srcList">
                      <div slot="error"
                        class="image-slot"
                        style="width:100%;height:100%;position:relative;">
                        <img src="@/assets/img/Img404.png"
                          alt=""
                          style="width:100%;height:100%">
                        <p style="font-size:14px;color:#c0c4cc;position:absolute;width:100%;top:66%;display:flex; justify-content: center;">网络开小差</p>
                      </div>
                    </el-image>
                  </div>
                </div>
                <p style="font-size:14px;margin-left:4px;">{{item.time}}</p>
              </li>
              <!-- <li v-if="imgListTwo.length === 0">
                <div style="width: 100%;height: 95%;"> -->
              <!-- <img src="@/assets/img/noneImg.png"
                v-if="imgListTwo.length === 0"
                alt=""> -->
              <!-- </div>
              </li> -->
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'monitoring',
  data () {
    return {
      aa: true,
      cameraInfo: {
        cameraName: '',
        name: ''
      },
      state: 1,
      tableData: [],
      leftIndex: 0,
      cameraIndexCode: '',
      imgListOne: [],
      imgListTwo: [],
      endTime: null,
      startTime: null,
      srcList: [],
      stationLists: []
    }
  },
  created () {

  },
  mounted () {
    this.initdata()
  },
  methods: {
    async initAllStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationLists = res.data
      } else this.$message.error('站点数据获取失败')
    },
    handleInit () {
      this.startTime = null
      this.endTime = null
      this.handleQuery()
    },
    times (cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, type: 4 })
      } else {
        return '暂无数据'
      }
    },
    handleImg (url) {
      this.srcList = []
      this.srcList.push(url)
    },
    handleQuery () {
      this.state = 1
      this.aa = false
      this.$api.product.getCamerImageByCamerCode({ camerCode: this.cameraIndexCode, startTime: this.startTime, endTime: this.endTime }).then(res => {
        if (res.code === 200) {
          this.imgListOne = []
          this.imgListOne = res.data
          this.aa = true
          this.imgListOne.forEach(v => {
            v.reportingTime = this.times(v.reportingTime)
          })
          this.monitor.forEach(v => {
            if (v.data.cameraCode === this.cameraIndexCode) {
              if (v.data.reportingTime.toString().length === 13) {
                v.data.reportingTime = this.times(v.data.reportingTime)
                this.imgListOne.unshift(v.data)
              } else {
                this.imgListOne.unshift(v.data)
              }
            }
          })
        } else {
          this.aa = true
          this.$message.error(res.msg)
        }
      })
    },
    handleSnap () {
      this.state = 2
      this.aa = true
      this.imgListTwo = []
      this.$api.product.manualGrab({ cameraIndexCode: this.cameraIndexCode }).then(res => {
        if (res.code === 200) {
          if (res.data.code === '0x0190003e') {
            this.$message.error('设备离线')
          } else {
            let obj = {}
            obj.picUrl = res.data.data.picUrl
            obj.time = this.times(res.data.time)
            this.imgListTwo.push(obj)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkMovies (item, val) {
      this.cameraIndexCode = item.cameraIndexCode
      this.leftIndex = val
      this.cameraInfo.cameraName = item.cameraName
      this.$api.product.getCameraByCameraCode({ cameraCode: this.cameraIndexCode }).then(res => {
        if (res.code === 200) {
          this.stationLists.forEach(v => {
            if (v.id === res.data) {
              this.cameraInfo.name = v.name
            }
          })
        }
      })
      this.handleInit()
    },
    initdata () {
      this.initAllStation()
      this.$api.product.getMonitoringResources({ pageSize: 100, pageNo: 1 }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.data.list
          this.cameraIndexCode = res.data.data.list[0].cameraIndexCode
          this.cameraInfo.cameraName = res.data.data.list[0].cameraName
          this.$api.product.getCameraByCameraCode({ cameraCode: this.cameraIndexCode }).then(res => {
            if (res.code === 200) {
              this.stationLists.forEach(v => {
                if (v.id === res.data) {
                  this.cameraInfo.name = v.name
                }
              })
            }
          })
          this.handleQuery()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  computed: {
    monitor () {
      return this.$store.state.sc_monitor
    },
    newImg () {
      // console.log(this.$store.state.sc_monitor)
      return this.$store.state.sc_newImg
    }
  },
  watch: {
    monitor (a, b) {
      // a.forEach(v => {
      //   if (v.data.cameraCode === this.cameraIndexCode) {
      //     if (v.data.reportingTime.toString().length === 13) {
      //       v.data.reportingTime = this.times(v.data.reportingTime)
      //       this.imgListOne.unshift(v.data)
      //     } else {
      //       console.log(v)
      //       this.imgListOne.unshift(v.data)
      //     }
      //   }
      //   // console.log(v.data.cameraCode + '----------' + this.cameraIndexCode)
      // })
    },
    newImg (a, b) {
      if (a.data.cameraCode === this.cameraIndexCode) {
        if (a.data.reportingTime.toString().length === 13) {
          a.data.reportingTime = this.times(a.data.reportingTime)
          this.imgListOne.unshift(a.data)
        } else {
          this.imgListOne.unshift(a.data)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.monitoring {
  height: 100%;
  width: 100%;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  display: flex;

  .treeBox {
    width: 250px;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-sizing: border-box;
    margin-right: 18px;
    padding: 10px 10px 10px 0;
    .iconBox {
      margin-right: 3px;
    }
    li {
      font-size: 14px;
      margin-bottom: 14px;
      border-left: 4px solid #fff;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .clickLi {
      border-left: 4px solid #4292ff;
    }
  }
  .rightBox {
    flex: 1;
    .videoBox {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
      .rightBottom {
        flex: 1;
        flex-direction: column;
        min-height: 250px;
        overflow: hidden;
        // height: 200px;
        display: flex;
        ul {
          padding: 0px 4.8% 0 4.8%;
          flex: 1;
          display: flex;
          align-content: flex-start;
          flex-wrap: wrap;
          li {
            width: 22.58%;
            height: 200px;
            background: #ffffff;
            margin-bottom: 46px;
            margin-right: 3.2%;
            border-radius: 4px;
            box-sizing: border-box;
            padding: 6px 6px 0px 6px;
            display: flex;
            flex-direction: column;
            .imgs {
              width: 100%;
              height: 81%;
              position: relative;
              // img {
              //   width: 100%;
              //   height: 100%;
              // }
            }
            p {
              flex: 1;
              display: flex;
              align-items: center;
            }
          }
        }
        ul > li:nth-child(4n + 0) {
          margin-right: 0px;
        }
      }
    }
  }
}
#scrollbar {
  height: 100%;
  width: 100%;
}
.newImg {
  color: red;
  margin-right: 10px;
  font-weight: bold;
}
/deep/ .el-button {
  padding: 8px 12px;
}
/deep/ .el-input__inner {
  height: 34px;
}
/deep/ .el-input__icon {
  line-height: 34px;
}
/deep/ .demo-image__preview {
  width: 100%;
  height: 100%;
}
.rightBottom /deep/ .el-scrollbar__thumb {
}
.rightBottom /deep/ .el-scrollbar__wrap {
  // overflow-x: hidden;
}
</style>
