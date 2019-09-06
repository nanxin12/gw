<template>
  <div class="box">
    <el-form class="topBox" :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item label="所属乡镇:">
        <el-select v-model="form.townId" placeholder="请选择" @change="townChange">
          <el-option v-for="item in townList" :label="item.positionName" :value="item.code" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属村:">
        <el-select v-model="form.villageId" placeholder="请选择" @change="villageChange">
          <el-option v-for="item in villageList" :label="item.positionName" :value="item.code" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属站点:">
        <el-select v-model="form.stationId" placeholder="请选择">
          <el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="110px" label="设备编号/名称:">
        <el-input v-model="form.e" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData">查找</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <ul class="contentBox">
      <li class="cbLis" v-for="item in tableData" :key="item.rtuDeviceId">
        <div class="dataBox">
          <div class="dataTitle">
            <p>{{item.rtuDeviceName}}</p>
            <p>{{item.code}}</p>
          </div>
          <div class="dataContent">
            <div class="dataFater">
              <div class="dfLeft">
                <i></i>
                <span>{{item.stationName}}</span>
              </div>
              <p @click="getHistory(item.rtuDeviceName, item.rtuDeviceId, item.code, item.stationName, item.sensorDatas)">查看历史</p>
            </div>
            <div class="bgBox"></div>
            <el-scrollbar style="flex: 1">
              <ul>
                <li class="line"></li>
                <li class="lineTwo"></li>
                <li v-for="items in item.sensorDatas" :key="items.id">
                  <p v-if="items.type === 'LIQUID_LEVEL'">液位</p>
                  <p v-if="items.type === 'PRESSURE'">压力</p>
                  <p v-if="items.type === 'BALANCE_OF_CL'">余氯</p>
                  <p v-if="items.type === 'PH'">PH值</p>
                  <p v-if="items.type === 'VOLTAGE'">电压</p>
                  <p v-if="items.type === 'SWITCH01'">开关第一路</p>
                  <p v-if="items.type === 'SWITCH02'">开关第二路</p>
                  <p v-if="items.type === 'WATER_METER'">流量计</p>
                  <p v-if="items.type === 'SWITCH01' || items.type === 'SWITCH02'" >{{items.value === 'ABNORMAL' ? '不正常' : items.value}}</p>
                  <p v-if="items.type !== 'SWITCH01' && items.type !== 'SWITCH02'">{{items.value}}</p>
                  <span v-for="itemss in unitList" :key="itemss.id" v-show="items.type === itemss.typeEnum">{{itemss.nuit}}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      class="bottomBox"
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChanges"
      :current-page="form.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="form.eltotalCount">
    </el-pagination>
    <div class="digSonBox" v-show="digShow">
      <div class="digTitle">
        <div class="titleLeft">{{equipmentName}}</div>
        <div class="titleContent">
          <span :class="{colors:tbOrCharts}" @click="tbOrCharts = true">表格</span><span :class="{colors:!tbOrCharts}" @click="tbOrCharts = false">曲线</span>
        </div>
        <div class="titleRight">
          <i class="el-icon-close" style="cursor: pointer;" @click="closeDig"></i>
        </div>
      </div>
      <div class="digSearchBox">
        <p @click="today">今天</p>
        <p @click="yesterday">昨天</p>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label="选择日期" style="margin-bottom: 0;margin-left: 40px;">
            <el-date-picker
              v-model="formInline.time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="监测类型" style="margin-bottom: 0;margin-left: 20px;">
            <el-select v-model="formInline.sensorTypes" placeholder="活动区域">
              <el-option v-for="item in searchList" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-button type="primary" @click="initHistoryData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="tbOrCharts">
        <el-table :data="digTableData" class="digTableBox" stripe border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{(formInline.page-1)*formInline.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" align="center">
            <template>
              <span>{{nowEquipment.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属站点" align="center">
            <template>
              <span>{{nowEquipment.station}}</span>
            </template>
          </el-table-column>
          <el-table-column label="监测类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'LIQUID_LEVEL'">液位</span>
              <span v-if="scope.row.type === 'PRESSURE'">压力</span>
              <span v-if="scope.row.type === 'BALANCE_OF_CL'">余氯</span>
              <span v-if="scope.row.type === 'PH'">PH值</span>
              <span v-if="scope.row.type === 'VOLTAGE'">电压</span>
              <span v-if="scope.row.type === 'WATER_METER'">流量计</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="监测数据" align="center"></el-table-column>
          <el-table-column label="数据单位" align="center">
            <template slot-scope="scope">
              <span v-for="item in unitList" :key="item.id" v-show="scope.row.type === item.typeEnum">{{item.nuit}}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter='formatter' label="监测时间" align="center"></el-table-column>
        </el-table>
        <div class="digBottom">
          <el-pagination
            style="margin: 0;"
            class="bottomBox"
            align="center"
            @size-change="digHandleSizeChange"
            @current-change="digHandleCurrentChanges"
            :current-page="formInline.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="formInline.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="formInline.eltotalCount">
          </el-pagination>
        </div>
      </div>
      <div id="chartsBox" v-show="!tbOrCharts"></div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'realdata',
  data () {
    return {
      forData: null,
      unitList: [
        {
          typeEnum: 'LIQUID_LEVEL',
          nuit: 'm³'
        },
        {
          typeEnum: 'PRESSURE',
          nuit: 'Pa'
        },
        {
          typeEnum: 'BALANCE_OF_CL',
          nuit: 'mg/L'
        },
        {
          typeEnum: 'PH',
          nuit: 'PH'
        },
        {
          typeEnum: 'VOLTAGE',
          nuit: 'V'
        },
        {
          typeEnum: 'SWITCH01',
          nuit: ''
        },
        {
          typeEnum: 'SWITCH02',
          nuit: ''
        }
      ],
      searchList: [],
      tbOrCharts: true,
      nowEquipment: {},
      typeNmaeList: [
        { name: '液位', value: 'LIQUID_LEVEL' },
        { name: '压力', value: 'PRESSURE' },
        { name: '余氯', value: 'BALANCE_OF_CL' },
        { name: 'PH值', value: 'PH' },
        { name: '电压', value: 'VOLTAGE' },
        { name: '流量计', value: 'WATER_METER' }
      ],
      formInline: {
        time: setTime({ type: 2 }),
        sensorTypes: null,
        size: 10,
        page: 1,
        rtuId: null
      },
      value1: [],
      equipmentName: null,
      townList: [],
      villageList: [],
      stationList: [],
      digTableData: [],
      tableData: [],
      form: {
        townId: null,
        villageId: null,
        stationId: null,
        page: 1,
        size: 10,
        eltotalCount: 0
      }
    }
  },
  beforeDestroy () {
    this.closeDig()
    window.clearInterval(this.forData)
  },
  created () {
    this.initData()
    this.initTownOrVillage(640402000000, 1)
    this.initStationData({})
    this.forData = setInterval(() => {
      this.initData()
    }, 180000)
  },
  computed: {
    digShow () {
      return this.$store.state.digShow
    }
  },
  methods: {
    today () {
      this.formInline.time = setTime({ date: new Date(), type: 2 })
    },
    yesterday () {
      this.formInline.time = setTime({ date: (new Date().getTime() - 24 * 60 * 60 * 1000), type: 2 })
    },
    closeDig () {
      this.$store.commit('changeDigShow', false)
    },
    digHandleSizeChange (values) {
      this.formInline.size = values
      this.initHistoryData()
    },
    digHandleCurrentChanges (values) {
      this.formInline.page = values
      this.initHistoryData()
    },
    async initTownOrVillage (code, type) {
      let res = await this.$api.organizeList.getRegionByCode({ code })
      if (res.code === 200) {
        if (type === 1) this.townList = res.data
        if (type === 2) this.villageList = res.data
      } else this.$message.error('数据获取失败')
    },
    villageChange () {
      this.form.stationId = null
      this.initStationData({ townId: this.form.townId, villageId: this.form.villageId })
    },
    async initStationData ({ townId = null, villageId = null }) {
      let res = await this.$api.product.getStationNoPage({ townId, villageId })
      if (res.code === 200) this.stationList = res.data
      else this.$message.error('数据获取失败')
    },
    townChange (val) {
      this.form.stationId = null
      this.form.villageId = null
      this.initTownOrVillage(val, 2)
      this.initStationData({ townId: this.form.townId })
    },
    getHistory (name, id, code, station, typeList) {
      if (!typeList.length) return this.$message.error('该设备暂无监测类型')
      this.searchList = []
      typeList.forEach(item => {
        this.typeNmaeList.forEach(items => {
          if (item.type === items.value) {
            let obj = {
              value: items.value,
              name: items.name
            }
            this.searchList.push(obj)
          }
        })
      })
      this.nowEquipment = { name, code, station }
      this.equipmentName = name
      this.$store.commit('changeDigShow', true)
      this.formInline.rtuId = id
      this.formInline.sensorTypes = this.searchList[0].value
      this.initHistoryData()
    },
    async initHistoryData () {
      let res = await this.$api.product.getHistoryDataPage(this.formInline)
      if (res.code === 200) {
        this.digTableData = res.data.list
        this.formInline.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
      let data = JSON.parse(JSON.stringify(this.formInline))
      delete data.size
      delete data.page
      let ress = await this.$api.product.getHistoryDataPage(data)
      if (ress.code === 200) {
        let x = []
        let y = []
        let name = ''
        if (ress.data.type.length) name = this.typeNmaeList.find(item => item.value === ress.data.type[0].type).name
        ress.data.type.forEach(item => {
          x.push(setTime({ date: item.time, number: 1000 }))
          y.push(Number(item.value))
        })
        x.reverse()
        y.reverse()
        let oneCharts = this.$echarts.init(document.getElementById('chartsBox'))
        oneCharts.setOption({
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%']
            }
          },
          title: {
            left: 'center',
            text: `${name}统计图`
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x
          },
          grid: {
            left: '4%',
            right: '4%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name,
              type: 'line',
              smooth: true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])
              },
              data: y
            }
          ]
        })
      } else this.$message.error('数据获取失败')
    },
    formatter (row) {
      if (row.time) return setTime({ date: row.time, number: 1000 })
      else return '暂无数据'
    },
    tableHeaderColor ({ rowIndex }) {
      if (Object.is(rowIndex, 0)) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    async initData () {
      // let ress = await this.$api.product.getParameter()
      // if (ress.code === 200) {
      //   this.unitList = ress.data
      // } else this.$message.error('数据获取失败')
      let res = await this.$api.product.getNowDataPage(this.form)
      if (res.code === 200) {
        this.form.eltotalCount = res.data.totalCount
        this.tableData = res.data.list
      } else this.$message.error('数据获取失败')
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.form.size = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.form.page = values
      this.initData()
    },
    reset () {
      this.form.townId = null
      this.form.villageId = null
      this.form.stationId = null
      this.villageList = []
      this.initData()
      this.initStationData({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .topBox{
      height: 62px;
      width: 100%;
    }

    .contentBox {
      flex: 1;
      background: #fff;
      border-radius: 10px;
      padding: 9px 11px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;

      .cbLis {
        width: 20%;
        height: 50%;
        padding: 25px 23px;
        box-sizing: border-box;

        .dataBox {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          .dataTitle {
            width: 100%;
            height: 60px;
            padding-top: 9px;
            box-sizing: border-box;
            background: linear-gradient(90deg, #2AD8F1 0%, #2BA4FF 100%);

            p {
              text-indent: 14px;
              font-weight: bold;
              color: #fff;
              line-height: 100%;
              margin-bottom: 11px;
            }
          }

          .dataContent {
            flex: 1;
            box-sizing: border-box;
            border: 1px solid #D9E2EA;
            border-top: none;
            display: flex;
            flex-direction: column;
            .dataFater {
              width: 100%;
              height: 33px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .dfLeft {
                margin-left: 10px;
                display: flex;
                align-items: center;

                i {
                  display: block;
                  width: 6px;
                  height: 6px;
                  background: #4292FF;
                  margin-right: 12px;
                }

                span {
                  color: #4292FF;
                }
              }

              p {
                margin-right: 6px;
                height: 22px;
                border-radius: 20px;
                color: #409EFF;
                background: #ecf5ff;
                border: 1px solid #b3d8ff;
                padding: 0 15px;
                font-size: 12px;
                line-height: 22px;
                cursor: pointer;
              }

              p:hover {
                border-color: #4292FF;
                background: #4292FF;
                color: #fff;
              }
            }

            .bgBox {
              width: 100%;
              height: 2px;
              background: #DDD;
            }
            /deep/ .el-scrollbar__wrap {
              overflow-x: hidden;
            }

            ul {
              width: 100%;
              height: 100%;
              position: relative;
              .line{
                width: 1px;
                height: 100%;
                position: absolute;
                display: block;
                top: 0;
                left: 40%;
                margin-left: -.5px;
                background: rgba(0,0,0,.05);
              }
              .lineTwo{
                width: 1px;
                height: 100%;
                position: absolute;
                display: block;
                top: 0;
                left: 80%;
                margin-left: -.5px;
                background: rgba(0,0,0,.05)!important;
              }
              li{
                width: 100%;
                height: 30px;
                cursor: pointer;
                display: flex;
                p{
                  width: 40%;
                  height: 30px;
                  line-height: 30px;
                  color: #4B4B4B;
                  text-align: center;
                }
                span{
                  display: block;
                  width: 20%;
                  height: 30px;
                  line-height: 30px;
                  color: #4B4B4B;
                  text-align: center;
                }
              }
              li:nth-child(even) {
                background: #fafafa;
              }
            }
          }
        }
      }
      .cbLis:nth-child(even) {
        .dataTitle{
          background:linear-gradient(90deg,#909CFE 0%,#6188FD 100%)!important;
        }
      }
    }
    .bottomBox{
      height: 28px;
      width: 100%;
      margin: 10px 0 20px 0;
    }
    .digSonBox{
      position: absolute;
      left: 50%;
      top: 38px;
      width: 1194px;
      height: 702px;
      margin-left: -597px;
      background: #fff;
      z-index: 999;
      padding: 0 30px;
      box-sizing: border-box;
      border-radius: 10px;
      .digTitle{
        height: 58px;
        width: 1134px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
        position: relative;
        .titleLeft{
          font-size: 16px;
        }
        .titleContent{
          position: absolute;
          left: 50%;
          margin-left: -75px;
          font-size: 18px;
          width: 150px;
          span{
            cursor: pointer;
          }
          span:nth-child(1) {
            margin-right: 78px;
          }
        }
        .titleRight{
          i{
            font-size: 22px;
          }
        }
      }
      .digSearchBox{
        width: 100%;
        height: 74px;
        display: flex;
        align-items: center;
        padding-left: 5px;
        box-sizing: border-box;
        p {
          margin-right: 10px;
          height: 22px;
          border-radius: 20px;
          color: #409EFF;
          background: #ecf5ff;
          border: 1px solid #b3d8ff;
          padding: 0 15px;
          font-size: 12px;
          line-height: 22px;
          cursor: pointer;
        }

        p:hover {
          border-color: #4292FF;
          background: #4292FF;
          color: #fff;
        }
      }
      .digTableBox{
        width: 100%;
        height: 501px;
      }
      .digBottom{
        height: 68px;
        width: 100%;
        display: flex;
        align-items: center;
      }
      #chartsBox{
        width: 1134px;
        height: 512px;
      }
    }
    .colors{
      color: #0099ff;
    }
  }
</style>
