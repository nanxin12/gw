<template>
  <div class="inner">
    <div class="nav">
      <div class="nav_flex">
        <div class="nav_box nav_box_first">
          <div class="nav_round_wrap">
            <div class="nav_round">
              <img src="@/assets/img/file-text.png"
                alt="">
            </div>
          </div>
          <div class="nav_title">
            <div>
              <span class="nav_title_class_one">{{this.purchasejnum}}</span>
              <span class="nav_title_class_two">个</span>
            </div>
            <div class="nav_title_class_three">
              当月采购计划
            </div>
          </div>
        </div>
        <div class="nav_box">
          <div class="nav_round_wrap"
            style="background: rgba(77,161,255, 0.2);">
            <div class="nav_round"
              style="background: rgba(77,161,255, 1);">
              <img src="@/assets/img/edit-3.png"
                alt="">
            </div>
          </div>
          <div class="nav_title">
            <div>
              <span class="nav_title_class_one">{{this.purchasesnum}}</span>
              <span class="nav_title_class_two">个</span>
            </div>
            <div class="nav_title_class_three">
              当月采购审批数
            </div>
          </div>
        </div>
      </div>
      <div class="nav_flex">
        <div class="nav_box nav_box_first">
          <div class="nav_round_wrap"
            style="background: rgba(255,205,49, 0.2);">
            <div class="nav_round"
              style="background: rgba(255,205,49, 1);">
              <img src="@/assets/img/archive.png"
                alt="">
            </div>
          </div>
          <div class="nav_title">
            <div>
              <span class="nav_title_class_one">{{this.applicationnum}}</span>
              <span class="nav_title_class_two">个</span>
            </div>
            <div class="nav_title_class_three">
              当月物资领取申请数
            </div>
          </div>
        </div>
        <div class="nav_box">
          <div class="nav_round_wrap"
            style="background: rgba(131,213,135, 0.2);">
            <div class="nav_round"
              style="background: rgba(131,213,135, 1);">
              <img src="@/assets/img/layers.png"
                alt="">
            </div>
          </div>
          <div class="nav_title">
            <div>
              <span class="nav_title_class_one">{{this.approvalsnum}}</span>
              <span class="nav_title_class_two">个</span>
            </div>
            <div class="nav_title_class_three">
              当月物资领取审批数
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content_box">
        <div id="myChart1"
          style="height:100%;flex:1;margin-right:19px;background: #fff;"></div>
        <div id="myChart2"
          style="height:100%;flex:1;background: #fff;"></div>
      </div>
      <div class="content_box">
        <div id="myChart3"
          style="height:100%;flex:1;margin-right:19px;background: #fff;"></div>
        <div id="myChart4"
          style="height:100%;flex:1;background: #fff;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Adduser3',
  data () {
    return {
      purchasejnum: '', // 当月采购计划数
      purchasesnum: '', // 当月采购审批数
      applicationnum: '', // 当月物资申请数
      approvalsnum: '', // 物资申请审批数
      // 返回数组对应柱状图
      purchase: [], // 当月采购计划数
      purchases: [], // 当月采购审批数
      applicationums: [], // 当月物资申请数
      approvalsums: [], // 当月物资申请审批数
      toptitle: [
        {
          title: '当月采购计划数',
          data: '9'
        },
        {
          title: '当月采购审批数',
          data: '8'
        },
        {
          title: '当月物资领取申请数',
          data: '4'
        },
        {
          title: '当月物资领取审批数',
          data: '1'
        }]
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      this.$api.goodsIndex.getList().then(res => {
        if (res.code === 200) {
          this.purchasejnum = res.data.purchasejnum
          this.purchasesnum = res.data.purchasesnum
          this.applicationnum = res.data.applicationnum
          this.approvalsnum = res.data.approvalsnum
          this.purchase = res.data.purchase
          this.purchases = res.data.purchases
          this.applicationums = res.data.applicationums
          this.approvalsums = res.data.approvalsums
          this.echarts1()
          this.echarts2()
          this.echarts3()
          this.echarts4()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    echarts1 () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart1'))
      // 绘制图表
      myChart.setOption({
        color: ['#8BC8FF'],
        title: {
          text: '采购计划统计',
          subtext: '事件数',
          top: '20px',
          left: '20px'
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '采购计划数',
            type: 'bar',
            data: this.purchase,
            barWidth: '60%'
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    echarts2 () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart2'))
      // 绘制图表
      myChart.setOption({
        color: ['#8BC8FF'],
        title: {
          text: '采购审批统计',
          subtext: '事件数',
          top: '20px',
          left: '20px'
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '采购审批数',
            type: 'bar',
            data: this.purchases,
            barWidth: '60%'
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    echarts3 () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart3'))
      // 绘制图表
      myChart.setOption({
        color: ['#F6C06C'],
        title: {
          text: '物资领取申请数',
          subtext: '事件数',
          top: '20px',
          left: '20px'
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '物资申请数',
            type: 'bar',
            data: this.applicationums,
            barWidth: '60%'
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    echarts4 () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart4'))
      // 绘制图表
      myChart.setOption({
        color: ['#FF8292'],
        title: {
          text: '物资领取审批数',
          subtext: '事件数',
          top: '20px',
          left: '20px'
        },
        grid: {
          // left: '3%',
          // right: '4%',
          bottom: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '物资领取审批数',
            type: 'bar',
            data: this.approvalsums,
            barWidth: '60%'
          }
        ]
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.nav {
  height: 120px;
  width: 100%;
  display: flex;
}
.nav_box {
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
}
.nav :last-child {
  margin-right: 0;
}
.nav_round_wrap {
  margin-top: 15px;
  margin-left: 15%;
  width: 90px;
  height: 90px;
  background: rgba(255, 123, 140, 0.2);
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  float: left;
}
.nav_round {
  width: 60px;
  height: 60px;
  background: rgba(255, 123, 140, 1);
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.nav_title {
  margin-top: 30px;
  float: left;
  margin-left: 14.02%;
}
.content {
  flex: 1;
  width: 100%;
  padding: 14px 0 35px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.content :first-child {
  margin-bottom: 14px;
}
.content_box {
  flex: 1;
  width: 100%;
  display: flex;
}
.nav_flex {
  flex: 1;
  margin-right: 19px;
  display: flex;
}
.nav :last-child {
  margin-right: 0;
}
.nav_box_first {
  margin-right: 19px;
}
.nav_title_class_one {
  font-size: 32px;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
  line-height: 27px;
}
.nav_title_class_two {
  font-size: 16px;
  font-weight: bold;
  color: rgba(75, 75, 75, 1);
  line-height: 27px;
  margin-left: 12px;
}
.nav_title_class_three {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(86, 86, 86, 1);
}
.nav_title > div {
  text-align: center;
}
</style>
