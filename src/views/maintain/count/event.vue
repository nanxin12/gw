<template>
  <div class="box">
    <div class="boxTitle">
      <el-form :inline="true"
        :model="formInline"
        class="demo-form-inline">
        <el-form-item label="选择时间:">
          <el-date-picker v-model="formInline.day"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="onSubmit">立即筛选</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="boxContent">
      <div class="bcTop">
        <div class="chartsBox">
          <div class="content">
            <div id="chartsOne"></div>
          </div>
        </div>
        <div class="chartsBox">
          <div class="content">
            <div id="chartsTwo"></div>
          </div>
        </div>
        <div class="tableBox">
          <div class="content">
            <h3 style="font-size:16px;">各站点事件数量统计表</h3>
            <el-table :data="tableData"
              style="width: 100%"
              size="mini"
              height="100%"
              :header-cell-style="tableHeaderColor">
              <el-table-column label="序号"
                align="center"
                width="50">
                <template slot-scope="scope">
                  <div>{{scope.$index+1}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="siteName"
                align="center"
                label="站点名称"></el-table-column>
              <el-table-column align="center"
                label="数量">
                <el-table-column prop="repair"
                  align="center"
                  label="维修事件"></el-table-column>
                <el-table-column prop="leakage"
                  align="center"
                  label="漏点事件"></el-table-column>
              </el-table-column>
              <el-table-column prop="sum"
                align="center"
                label="合计"
                width="150"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="bcBottom">
        <div class="content">
          <div class="title">
            <div>
              <el-date-picker v-model="bottomTime"
                @change="bottomTimeChange"
                :clearable='false'
                :editable='false'
                type="year"
                value-format="timestamp"
                placeholder="选择年">
              </el-date-picker>
            </div>
            <div class="titles">年度事件数量统计</div>
          </div>
          <div id="chartsThree"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'event',
  data () {
    return {
      formInline: {
        day: null
      },
      bottomTime: null,
      tableData: [
      ]
    }
  },
  mounted () {
    this.bottomTime = 1565942698 * 1000
    this.initData()
    this.bottomTimeChange(null)
  },
  methods: {
    tableHeaderColor (obj) {
      if ((obj.rowIndex === 0 && obj.columnIndex === 2) || obj.rowIndex === 1) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#EBEEF5;height:10px!important;'
      } else {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#EBEEF5;height:40px!important;'
      }
    },
    onSubmit () {
      let date = this.formInline.day
      if (date) {
        let startDate = date[0] / 1000
        let endDate = date[1] / 1000
        this.initData(startDate, endDate)
      } else {
        this.initData(null, null)
      }
    },
    chartsOne (val) {
      let chartsOne = this.$echarts.init(document.querySelector('#chartsOne'))
      chartsOne.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '事件状态统计',
          x: 'center',
          itemGap: 21, // 主标题下边的距离
          textStyle: { // 主标题
            color: '#4B4B4B',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '0%',
          top: '0%'
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: '运动达标率',
            textAlign: 'center',
            fill: '#333',
            fontSize: 20,
            fontWeight: 700
          }
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['已完成', '待处理', '处理中', '无效事件'],
          top: '12%',
          left: '0%'
        },
        series: [
          {
            name: '事件状态统计',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['52%', '58%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: val[2] ? val[2].value : 0, name: '已完成', itemStyle: { normal: { color: '#8BC8FF' } } },
              { value: val[1] ? val[1].value : 0, name: '待处理', itemStyle: { normal: { color: '#919EFF' } } },
              { value: val[3] ? val[3].value : 0, name: '处理中', itemStyle: { normal: { color: '#FFA08D' } } },
              { value: val[0] ? val[0].value : 0, name: '无效事件', itemStyle: { normal: { color: '#FFD58C' } } }
            ]
          }
        ]
      })
      window.addEventListener('resize', function () {
        chartsOne.resize()
      })
    },
    chartsTwo (val) {
      let chartsTwo = this.$echarts.init(document.querySelector('#chartsTwo'))
      chartsTwo.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '事件数量统计',
          x: 'center',
          itemGap: 21, // 主标题下边的距离
          textStyle: { // 主标题
            color: '#4B4B4B',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '0%',
          top: '0%'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['维修事件', '漏点事件'],
          top: '12%',
          left: '0%'
        },
        series: [
          {
            name: '事件状态统计',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['52%', '58%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: val.yData.length ? val.yData[0] : 0, name: '维修事件', itemStyle: { normal: { color: '#8BC8FF' } } },
              { value: val.yData.length ? val.yData[1] : 0, name: '漏点事件', itemStyle: { normal: { color: '#FFA08D' } } }
            ]
          }
        ]
      })
      window.addEventListener('resize', function () {
        chartsTwo.resize()
      })
    },
    chartsThree (x, y) {
      let chartsThree = this.$echarts.init(document.querySelector('#chartsThree'))
      chartsThree.setOption({
        title: {
          text: '事件数',
          x: 'center',
          // itemGap: 35, // 主标题下边的距离
          textStyle: { // 主标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          subtextStyle: { // 副标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '5%',
          top: '4%'
        },
        legend: {
          data: ['维修事件', '漏点事件'],
          top: '0%'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '4%',
          right: '4%',
          top: '10%',
          bottom: '6%',
          containLabel: true
          // x: '2%', // 左上角x轴距盒子边框的距离
          // y: '2%', // 左上角Y轴距盒子边框的距离
          // x2: '0', // 右下角x轴距盒子边框的距离
          // y2: '20%', // 右下角Y轴距盒子边框的距离
          // borderWidth: 1
        },
        xAxis: [
          {
            type: 'category',
            data: x,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#4B4B4B',
                fontSize: 12
              }
            }
          }
        ],
        series: [
          {
            name: '维修事件',
            type: 'bar',
            barWidth: '26px',
            data: y[0].data,
            color: '#8BC8FF'
          },
          {
            name: '漏点事件',
            type: 'bar',
            barWidth: '26px',
            data: y[1].data,
            color: '#FFD58C'
          }
        ]
      })
      window.addEventListener('resize', function () {
        chartsThree.resize()
      })
    },
    bottomTimeChange (val) {
      let date = null
      if (val !== null) {
        date = val / 1000
      }
      this.$api.maintain.statInYear({ date: date }).then(res => {
        if (res.code === 200) {
          this.chartsThree(res.data.xAxisData, res.data.series)
        }
      })
    },
    initData (s, e) {
      // 两个饼图
      this.$api.maintain.findEventStatusOrCount({ startDate: s, endDate: e }).then(res => {
        if (res.code === 200) {
          this.chartsOne(res.data.kvObjectVo)
          this.chartsTwo(res.data.listObjectVo)
        }
      })
      // 表格
      this.$api.maintain.findEventSiteCensus().then(res => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
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
  .boxTitle {
    width: 100%;
    height: 40px;
    margin-bottom: 14px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .boxContent {
    flex: 1;
    .bcTop {
      width: 100%;
      height: 50%;
      padding-bottom: 14px;
      box-sizing: border-box;
      display: flex;
      .chartsBox {
        width: 25%;
        height: 100%;
        padding-right: 14px;
        box-sizing: border-box;
        .content {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          #chartsOne {
            width: 90%;
            height: 90%;
          }
          #chartsTwo {
            height: 90%;
            width: 90%;
          }
        }
      }
      .tableBox {
        width: 50%;
        height: 100%;
        .content {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 4px;
          padding: 15px 36px 40px 36px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          h3 {
            height: 24px;
            font-size: 18px;
            color: #4b4b4b;
            margin-bottom: 15px;
          }
        }
      }
    }
    .bcBottom {
      width: 100%;
      height: 50%;
      padding-bottom: 28px;
      box-sizing: border-box;
      .content {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .title {
          margin-top: 27px;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          padding-left: 3.952%;
          box-sizing: border-box;
          .titles {
            font-size: 16px;
            color: #4b4b4b;
            margin-left: 0.94%;
          }
        }
        #chartsThree {
          // width: 90%;
          width: 100%;
          height: 90%;
        }
      }
    }
  }
}
.bcBottom /deep/ .el-input {
  width: 95px;
  height: 40px;
}
.box /deep/ .el-table thead.is-group th {
  padding: 0px 0px;
}
</style>
