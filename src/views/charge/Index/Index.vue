<template>
  <div class="indexBox">
    <div class="ibTopBox">
      <ul>
        <li v-for="item in toptitle" :key="item.id">
          <span>{{item.title}}</span>
          <p>{{item.data}}</p>
        </li>
      </ul>
    </div>
    <div class="chartBox">
      <ul>
        <li>
          <div class="oneCharts"></div>
        </li>
        <li>
          <div class="twoCharts"></div>
        </li>
        <li>
          <div class="threeCharts"></div>
        </li>
        <li>
          <div class="fourCharts"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'Index',
  data () {
    return {
      toptitle: [
        {
          title: '总户数',
          data: ''
        },
        {
          title: '在线总户数',
          data: ''
        },
        {
          title: '当月总缴费金额',
          data: ''
        },
        {
          title: '总售水量',
          data: ''
        },
        {
          title: '上月应收金额',
          data: ''
        },
        {
          title: '上月实收金额',
          data: ''
        },
        {
          title: '欠费总户数',
          data: ''
        }
      ],
      income: [],
      arrearage: [],
      lastWater: [],
      nowWater: [],
      payMoney: [],
      oneCharts: null,
      twoCharts: null,
      threeCharts: null,
      fourCharts: null
    }
  },
  mounted () {
    this.initTitData()
    this.initChartsData()
  },
  methods: {
    // 初始化echatrs
    initPayCharts () {
      let obj = {
        wxPayMoney: null,
        cashPayMoney: null,
        aliPayMoney: null,
        terminalPayMoney: null,
        hallPayMoney: null,
        appPayMoney: null
      }
      if (this.payMoney.length) obj = this.payMoney[this.payMoney.length - 1]
      this.oneCharts = this.$echarts.init(document.getElementsByClassName('oneCharts')[0])
      this.oneCharts.setOption({
        color: ['#79E898', '#FFBE8C', '#8BC8FF', '#FFA08D', '#919EFF', '#FFD58C'],
        title: {
          text: '实收金额',
          textStyle: {
            color: '#385276',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 元  ({d}%)'
        },
        legend: {
          data: ['微信', '支付宝', '现金', '缴费机', '营业厅', 'APP']
        },
        series: [
          {
            name: '支付方式',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c} 元  {per|{d}%}  ',
                backgroundColor: '#fff',
                borderColor: '#aaa',
                borderWidth: 0.5,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.2,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#b8b8b8',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              {
                value: obj.wxPayMoney,
                name: '微信'
              },
              {
                value: obj.cashPayMoney,
                name: '现金'
              },
              {
                value: obj.aliPayMoney,
                name: '支付宝'
              }
            ]
          },
          {
            name: '缴费方式',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: obj.terminalPayMoney, name: '缴费机' },
              { value: obj.hallPayMoney, name: '营业厅' },
              { value: obj.appPayMoney, name: 'APP' }
            ]
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.oneCharts.resize()
      })
    },
    initIncomeCharts () {
      let x = []
      let y1 = []
      let y2 = []
      this.income.forEach(item => {
        x.push(setTime({ date: item.countTime, number: 1000, type: 3 }))
        y1.push(item.realAmount)
        y2.push(item.amountReceivable)
      })
      this.twoCharts = this.$echarts.init(document.getElementsByClassName('twoCharts')[0])
      this.twoCharts.setOption({
        title: {
          text: '金额收取对比',
          textStyle: {
            color: '#385276',
            fontSize: 18
          },
          subtext: '                     元',
          itemGap: 20, // 主标题下边的距离
          subtextStyle: { // 副标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#4292FF', '#FFC333'],
        legend: {
          data: ['应收金额', '实收金额']
        },
        xAxis: [
          {
            type: 'category',
            data: x,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {}
        ],
        series: [
          {
            barMaxWidth: 30,
            name: '应收金额',
            type: 'bar',
            data: y2
          },
          {
            barMaxWidth: 30,
            name: '实收金额',
            type: 'bar',
            data: y1
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.twoCharts.resize()
      })
    },
    initArrearageCharts () {
      let x = []
      let y = []
      this.income.forEach(item => {
        x.push(setTime({ date: item.countTime, number: 1000, type: 3 }))
        y.push(item.totalAmountDue)
      })
      this.fourCharts = this.$echarts.init(document.getElementsByClassName('fourCharts')[0])
      this.fourCharts.setOption({
        title: {
          text: '欠费金额',
          textStyle: {
            color: '#385276',
            fontSize: 18
          },
          subtext: '                     元',
          itemGap: 20, // 主标题下边的距离
          subtextStyle: { // 副标题
            color: '#4B4B4B',
            fontSize: 12,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#4292FF'],
        legend: {
          data: ['欠费总金额']
        },
        xAxis: [
          {
            type: 'category',
            data: x,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {}
        ],
        series: [
          {
            name: '欠费总金额',
            type: 'bar',
            barWidth: '60%',
            stack: '欠费',
            barMaxWidth: 30,
            data: y
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.fourCharts.resize()
      })
    },
    initWaterCharts () {
      let x = []
      let y1 = []
      let y2 = []
      this.lastWater.forEach(item => {
        y1.push(item.sumTotal)
      })
      this.nowWater.forEach(item => {
        x.push(setTime({ date: item.countTime, number: 1000, type: 3 }))
        y2.push(item.sumTotal)
      })
      this.threeCharts = this.$echarts.init(document.getElementsByClassName('threeCharts')[0])
      this.threeCharts.setOption({
        title: {
          text: '售水量',
          textStyle: {
            color: '#385276',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#4292FF', '#FFC333'],
        legend: {
          data: ['今年水量', '去年水量']
        },
        xAxis: [
          {
            type: 'category',
            data: x,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {}
        ],
        series: [
          {
            barMaxWidth: 30,
            name: '今年水量',
            type: 'bar',
            data: y2
          },
          {
            barMaxWidth: 30,
            name: '去年水量',
            type: 'bar',
            data: y1
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.threeCharts.resize()
      })
    },
    // 初始化头部数据
    async initTitData () {
      let res = await this.$api.sso.getIndexTitData()
      if (res.code === 200) {
        this.toptitle[0].data = res.data.totalUser
        this.toptitle[1].data = res.data.onLine
        this.toptitle[2].data = res.data.sumTotal.payMoneyTotal
        this.toptitle[3].data = res.data.sumMoneyAndTotal.sumTotal
        this.toptitle[4].data = res.data.amount.amountReceivable
        this.toptitle[5].data = res.data.amount.realAmount
        this.toptitle[6].data = res.data.arrearage
      } else this.$message.error('数据获取失败')
    },
    // 初始化图表数据
    async initChartsData () {
      let res = await this.$api.sso.getIndexChartsData()
      if (res.code === 200) {
        this.income = []
        this.arrearage = []
        this.lastWater = []
        this.payMoney = []
        res.data.columnList.forEach(item => {
          let obj = {
            amountReceivable: item.amountReceivable,
            realAmount: item.realAmount,
            countTime: item.countTime,
            totalAmountDue: item.totalAmountDue
          }
          let objs = {
            countTime: item.countTime,
            totalAmountDue: item.totalAmountDue
          }
          let objss = {
            countTime: item.countTime,
            terminalPayMoney: item.terminalPayMoney,
            hallPayMoney: item.hallPayMoney,
            appPayMoney: item.appPayMoney,
            aliPayMoney: item.aliPayMoney,
            cashPayMoney: item.cashPayMoney,
            wxPayMoney: item.wxPayMoney
          }
          this.income.push(obj)
          this.arrearage.push(objs)
          this.payMoney.push(objss)
        })
        res.data.lastYearYeildTota.forEach(item => {
          let obj = {
            countTime: item.countTime,
            sumTotal: item.sumTotal
          }
          this.lastWater.push(obj)
        })
        res.data.nowYearYeildTotal.forEach(item => {
          let obj = {
            countTime: item.countTime,
            sumTotal: item.sumTotal
          }
          this.nowWater.push(obj)
        })
        this.initIncomeCharts()
        this.initArrearageCharts()
        this.initWaterCharts()
        this.initPayCharts()
      } else this.$message.error('数据获取失败')
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.oneCharts.resize()
    })
    window.removeEventListener('resize', () => {
      this.twoCharts.resize()
    })
    window.removeEventListener('resize', () => {
      this.threeCharts.resize()
    })
    window.removeEventListener('resize', () => {
      this.fourCharts.resize()
    })
  }
}
</script>

<style lang="scss" scoped>
  .indexBox {
    height: 100%;
    display: flex;
    flex-direction: column;

    .ibTopBox {
      margin-bottom: 20px;
      box-sizing: border-box;
      ul {
        display: flex;
        justify-content: space-around;

        li:nth-child(1):hover {
          background: #34c43b;
        }

        li:nth-child(2):hover {
          background: #37b6db;
        }

        li:nth-child(3):hover {
          background: #fb8d8f;
        }

        li:nth-child(4):hover {
          background: #aa8cdc;
        }

        li:nth-child(5):hover {
          background: #feb54c;
        }

        li:nth-child(6):hover {
          background: #6a9ce8;
        }

        li:nth-child(7):hover {
          background: #ce4928;
        }

        li {
          cursor: pointer;
          width: 13%;
          height: 85px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 1px 8px 0px rgba(162, 162, 162, 0.3);
          border-radius: 6px;
          transition: all .4s;
          color: rgba(66, 146, 255, 1);

          span {
            display: flex;
            align-items: center;
            height: 50%;
            justify-content: center;
            font-size: 20px;
          }

          p {
            font-weight: 700;
            display: flex;
            align-items: center;
            height: 50%;
            justify-content: center;
            font-size: 22px;
          }
        }

        li:hover {
          color: rgba(255, 255, 255, 1) !important;
          background: rgba(66, 146, 255, 1) !important;
          box-shadow: 0px 2px 11px 5px rgba(162, 162, 162, 0.3);
          transform: translate(0, 3px);
        }
      }
    }

    .chartBox {
      box-sizing: border-box;
      flex: 1;

      ul {
        height: 100%;
        display: flex;
        flex-wrap: wrap;

        li {
          width: 50%;
          height: 50%;
          display: flex;
          padding: 5px;
          box-sizing: border-box;
          div {
            height: 100%;
            width: 100%;
            background: #fff;
            padding: 20px;
            box-sizing: border-box;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
