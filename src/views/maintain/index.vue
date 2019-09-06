<template>
  <div class="box">
    <ul class="titleBox">
      <li>
        <div class="liBox">
          <div class="lbTop">总事件数</div>
          <div class="lbContent">
            <div class="lbcLeft">
              <p :title="this.numberEvents.total">{{this.numberEvents.total}}</p>
              <span>个</span>
            </div>
            <div class="lbcRight"></div>
          </div>
          <img src="../../assets/img/onelog.png"
            alt="">
        </div>
      </li>
      <li>
        <div class="liBox">
          <div class="lbTop">待处理</div>
          <div class="lbContent">
            <div class="lbcLeft">
              <p :title="this.numberEvents.kvObjectVo[1].value">{{this.numberEvents.kvObjectVo[1].value}}</p>
              <span>个</span>
            </div>
            <div class="lbcRight"></div>
          </div>
          <img src="../../assets/img/twolog.png"
            alt="">
        </div>
      </li>
      <li>
        <div class="liBox">
          <div class="lbTop">处理中</div>
          <div class="lbContent">
            <div class="lbcLeft">
              <p :title="this.numberEvents.kvObjectVo[3].value">{{this.numberEvents.kvObjectVo[3].value}}</p>
              <span>个</span>
            </div>
            <div class="lbcRight"></div>
          </div>
          <img src="../../assets/img/threelog.png"
            alt="">
        </div>
      </li>
      <li>
        <div class="liBox">
          <div class="lbTop">已完成</div>
          <div class="lbContent">
            <div class="lbcLeft">
              <p :title="this.numberEvents.kvObjectVo[2].value">{{this.numberEvents.kvObjectVo[2].value}}</p>
              <span>个</span>
            </div>
            <div class="lbcRight"></div>
          </div>
          <img src="../../assets/img/fourlog.png"
            alt="">
        </div>
      </li>
      <li>
        <div class="liBox">
          <div class="lbTop">无效事件数</div>
          <div class="lbContent">
            <div class="lbcLeft">
              <p :title="this.numberEvents.kvObjectVo[0].value">{{this.numberEvents.kvObjectVo[0].value}}</p>
              <span>个</span>
            </div>
            <div class="lbcRight"></div>
          </div>
          <img src="../../assets/img/fivelog.png"
            alt="">
        </div>
      </li>
    </ul>
    <div class="contentBox">
      <div class="cbtop">
        <div class="cbtLeft">
          <div class="padBox">
            <div id="chatsOne"></div>
          </div>
        </div>
        <div class="cbtRight">
          <div id="chatsTwo"></div>
        </div>
      </div>
      <div class="cbBottom">
        <div id="chatsThree"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      numberEvents: {
        kvObjectVo: [
          {
            value: '0'
          },
          {
            value: '0'
          },
          {
            value: '0'
          },
          {
            value: '0'
          }
        ]
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    oneCharts (x, y) {
      let oneCharts = this.$echarts.init(document.querySelector('#chatsOne'))
      oneCharts.setOption({
        title: {
          text: '事件处理时长统计',
          subtext: '       事件数',
          x: 'center',
          itemGap: 28, // 主标题下边的距离
          textStyle: { // 主标题
            color: '#4B4B4B',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          subtextStyle: { // 副标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '6%',
          top: '1%'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '6%',
          right: '4%',
          top: '24%',
          bottom: '4%',
          containLabel: true
        },
        // xAxis: {
        //   type: 'category',
        //   boundaryGap: false,
        //   data: x,
        //   axisLabel: {
        //     color: '#fff',
        //     fontSize: 14
        //   }
        // },
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
            name: '事件数',
            type: 'bar',
            barWidth: '26px',
            data: y,
            color: '#8BC8FF'
          }
        ]
      })
      window.addEventListener('resize', function () {
        oneCharts.resize()
      })
    },
    twoCharts () {
      let twoCharts = this.$echarts.init(document.querySelector('#chatsTwo'))
      twoCharts.setOption({
        title: {
          text: '事件状态统计',
          x: 'center',
          textStyle: {
            color: '#4B4B4B',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '8%',
          top: '1%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: '20%',
          left: '8%',
          data: ['已完成', '待处理', '处理中', '无效事件']
        },
        series: [
          {
            name: '事件状态',
            type: 'pie',
            radius: '80%',
            center: ['60%', '55%'],
            data: [
              { value: this.numberEvents.kvObjectVo[1].value, name: '待处理', itemStyle: { normal: { color: '#919EFF' } } },
              { value: this.numberEvents.kvObjectVo[3].value, name: '处理中', itemStyle: { normal: { color: '#FFA08D' } } },
              { value: this.numberEvents.kvObjectVo[2].value, name: '已完成', itemStyle: { normal: { color: '#8BC8FF' } } },
              { value: this.numberEvents.kvObjectVo[0].value, name: '无效事件', itemStyle: { normal: { color: '#FFD58C' } } }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.addEventListener('resize', function () {
        twoCharts.resize()
      })
    },
    threeCharts (x, y) {
      let threeCharts = this.$echarts.init(document.querySelector('#chatsThree'))
      threeCharts.setOption({
        title: {
          text: '事件处理时长统计',
          subtext: '       事件数',
          x: 'center',
          itemGap: 20, // 主标题下边的距离
          textStyle: { // 主标题
            color: '#4B4B4B',
            fontSize: 18,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          subtextStyle: { // 副标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          },
          left: '3%',
          top: '1%'
        },
        legend: {
          data: ['维修事件', '漏点事件'],
          top: '6%'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          // top: '35%',
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
        threeCharts.resize()
      })
    },
    initData () {
      this.$api.maintain.findEventStatusOrCount().then(res => {
        if (res.code === 200) {
          this.numberEvents = res.data
          this.twoCharts()
        }
      })
      this.$api.maintain.sizeCensus().then(res => {
        if (res.code === 200) {
          this.oneCharts(res.data.xData, res.data.yData)
        }
      })
      this.$api.maintain.statInYear().then(res => {
        if (res.code === 200) {
          // this.threeCharts(res.data.xData, res.data.yData)
          this.threeCharts(res.data.xAxisData, res.data.series)
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
  .titleBox {
    height: 140px !important;
    width: 100%;
    display: flex;
    li {
      cursor: pointer;
      width: 20%;
      height: 100%;
      padding-right: 14px;
      .liBox {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        color: #fff;
        .lbTop {
          box-sizing: border-box;
          height: 55px;
          font-size: 16px;
          text-indent: 40px;
          padding-top: 30px;
          font-weight: 700;
        }
        .lbContent {
          height: 85px;
          width: 100%;
          background-image: url("../../assets/img/bl.png");
          background-size: 100% 100%;
          display: flex;
          align-items: baseline;
          .lbcLeft {
            flex: 1;
            width: 0;
            display: flex;
            align-items: baseline;
            padding-right: 10px;
            box-sizing: border-box;
            p {
              font-size: 32px;
              padding: 0 10px 0 40px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            span {
              font-size: 16px;
              font-weight: 700;
            }
          }
          .lbcRight {
            width: 120px;
          }
        }
        img {
          position: absolute;
          right: 48px;
          bottom: 32px;
          width: 72px;
          height: 72px;
        }
      }
    }
    li:nth-child(1) {
      .liBox {
        background-color: #ffa08d;
      }
    }
    li:nth-child(2) {
      .liBox {
        background: #6ebaff;
      }
    }
    li:nth-child(3) {
      .liBox {
        background: #919eff;
      }
    }
    li:nth-child(4) {
      .liBox {
        background: #6ebaff;
      }
    }
    li:nth-child(5) {
      padding-right: 0;
      .liBox {
        background: #919eff;
      }
    }
  }
  .contentBox {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 14px 0 15px 0;
    box-sizing: border-box;
    .cbtop {
      width: 100%;
      height: 55%;
      padding-bottom: 14px;
      box-sizing: border-box;
      display: flex;
      .cbtLeft {
        width: 55%;
        height: 100%;
        padding-right: 14px;
        box-sizing: border-box;
        .padBox {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          #chatsOne {
            width: 100%;
            // width: 90%;
            height: 90%;
          }
        }
      }
      .cbtRight {
        width: 45%;
        height: 100%;
        background: #fff;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        #chatsTwo {
          // width: 90%;
          width: 100%;
          height: 90%;
        }
      }
    }
    .cbBottom {
      width: 100%;
      height: 45%;
      background: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      #chatsThree {
        // width: 90%;
        width: 100%;
        height: 90%;
      }
    }
  }
}
</style>
