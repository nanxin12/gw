<template>
  <div class="payTypeBox">
    <div class="pbTop">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="所属镇:">
          <el-select v-model="formInline.townId" placeholder="请选择镇" @change="changeCun">
            <el-option :label="item.positionName" :value="item.code" v-for="item in townList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村:">
          <el-select v-model="formInline.villageId" placeholder="请选择村" @change="changeCunName">
            <el-option label="所有村" value=""></el-option>
            <el-option :label="item.positionName" :value="item.code" v-for="item in villageList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initchartsdata">立即查询</el-button>
          <el-button type="primary" @click="reset">重置内容</el-button>
          <el-button type="primary" @click="print">打印数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="oneCharts"></div>
    <div ref="printBox">
      <img src="" alt="" ref="imgbox" v-show="dayin">
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'payType',
  data () {
    return {
      dayin: false,
      formInline: {
        townId: null,
        villageId: ''
      },
      town: '',
      villageName: '',
      townName: null,
      townList: [],
      villageList: [],
      oneCharts: null
    }
  },
  mounted () {
    this.initdata()
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.oneCharts.resize()
    })
  },
  methods: {
    changeCunName (val) {
      if (val === '') return false
      this.villageName = this.villageList.find(item => item.code === val).positionName
    },
    async changeCun (val) {
      this.townName = this.townList.find(item => item.code === val).positionName
      let res = await this.$api.organizeList.getRegionByCode({ code: val })
      if (res.code === 200) {
        this.formInline.villageId = ''
        this.villageName = ''
        this.villageList = res.data
      }
    },
    // 打印图表
    print () {
      this.dayin = true
      setTimeout(() => {
        this.$print(this.$refs.printBox)
        this.dayin = false
      }, 50)
    },
    // 初始化镇
    async initdata () {
      let res = await this.$api.organizeList.getRegionByCode({ code: 640402000000 })
      if (res.code === 200) {
        this.townList = res.data
        this.formInline.townId = res.data[0].code
        let ress = await this.$api.organizeList.getRegionByCode({ code: res.data[0].code })
        if (ress.code === 200) {
          this.villageList = ress.data
        }
        this.townName = res.data[0].positionName
        this.initchartsdata()
      } else this.$message.error('地区数据获取失败')
    },
    // 初始化图表数据
    async initchartsdata () {
      let res = await this.$api.sso.getDataPageMsg(this.formInline)
      if (res.code === 200) {
        this.initCharts(res.data.columnList)
      } else this.$message.error('数据获取失败')
    },
    initCharts (data) {
      let mapx = []
      let cash = []
      let hall = []
      let wx = []
      let terminal = []
      let app = []
      let ali = []
      data.forEach((item) => {
        mapx.push(setTime({ date: item.countTime, type: 3, number: 1000 }))
        cash.push(item.cashPayMoney)
        hall.push(item.hallPayMoney)
        wx.push(item.wxPayMoney)
        terminal.push(item.terminalPayMoney)
        app.push(item.appPayMoney)
        ali.push(item.aliPayMoney)
      })
      let imgBase64 = ''
      this.oneCharts = this.$echarts.init(document.getElementsByClassName('oneCharts')[0])
      this.oneCharts.setOption({
        title: {
          text: `${this.townName}${this.villageName}每月收费统计`,
          x: 'left',
          y: 'top',
          textStyle: {
            color: '#385276',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          padding: [0, 0, 0, 0],
          x: 'center',
          y: 'top',
          data: ['支付宝金额', '微信金额', 'app金额', '营业厅金额', '缴费机金额', '现金金额']
        },
        xAxis: [
          {
            data: mapx
          }
        ],
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        series: [
          {
            name: '支付宝金额',
            type: 'bar',
            stack: '总金额',
            data: ali,
            barMaxWidth: 30,
            itemStyle: {
              color: '#8bc8ff'
            }
          },
          {
            name: '微信金额',
            type: 'bar',
            stack: '总金额',
            data: wx,
            barMaxWidth: 30,
            itemStyle: {
              color: '#79E898'
            }
          },
          {
            name: 'app金额',
            type: 'bar',
            stack: '总金额',
            data: app,
            barMaxWidth: 30,
            itemStyle: {
              color: '#ffd58c'
            }
          },
          {
            name: '营业厅金额',
            type: 'bar',
            stack: '总金额',
            data: hall,
            barMaxWidth: 30,
            itemStyle: {
              color: '#919eff'
            }
          },
          {
            name: '缴费机金额',
            type: 'bar',
            stack: '总金额',
            data: terminal,
            barMaxWidth: 30,
            itemStyle: {
              color: '#ffa08d'
            }
          },
          {
            name: '现金金额',
            type: 'bar',
            stack: '总金额',
            data: cash,
            barMaxWidth: 30,
            itemStyle: {
              color: '#ffbe8c'
            }
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.oneCharts.resize()
      })
      setTimeout(() => {
        imgBase64 = this.oneCharts.getDataURL()
        this.$refs.imgbox.src = imgBase64
      }, 1000)
    },
    // 重置搜索
    reset () {
      this.formInline = {
        townId: null,
        villageId: null
      }
      this.initchartsdata()
    }
  }
}
</script>

<style lang="scss" scoped>
  .payTypeBox {
    .pbTop {
      padding-top: 20px;
    }

    .oneCharts {
      height: 720px;
      width: 100%;
      padding-bottom: 10px;
    }
  }

</style>
