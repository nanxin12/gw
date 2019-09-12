<template>
  <div class="regionBox">
    <div class="rbTop">
      <el-form :inline="true" :model="formInline">
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
      <div class="tableFather">
        <el-table :data="tableData" border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="日期" align="center"></el-table-column>
          <el-table-column prop="data" label="用水量(吨)" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'dayWater',
  data () {
    return {
      dayin: false,
      formInline: {
        townId: null,
        villageId: ''
      },
      villageList: [],
      townList: [],
      townName: null,
      villageName: '',
      tableData: [],
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
      this.villageName = this.villageList.find(item => item.code === val).positionName
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
    // 表头颜色改变
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #eff2f7;color: #282d4d;font-weight: 700;'
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
    // 重置搜索条件
    reset () {
      this.formInline.townId = null
      this.formInline.villageId = null
      this.initchartsdata()
    },
    // 初始化图表数据
    async initchartsdata () {
      let res = await this.$api.sso.getDataPageMsg(this.formInline)
      if (res.code === 200) {
        this.initchars(res.data.nearMonthYieldTotal)
      } else this.$message.error('数据获取失败')
    },
    // 打印
    print () {
      this.dayin = true
      setTimeout(() => {
        this.$print(this.$refs.printBox)
        this.dayin = false
      }, 50)
    },
    // 初始化图表
    initchars (data) {
      this.tableData = []
      let x = []
      let y = []
      data.forEach(item => {
        y.push(item.sumTotal)
        x.push(setTime({ date: item.countTime, type: 2, number: 1000 }))
        let obj = {
          data: item.sumTotal,
          time: setTime({ date: item.countTime, type: 2, number: 1000 })
        }
        this.tableData.push(obj)
      })
      let imgBase64 = ''
      this.oneCharts = this.$echarts.init(document.getElementsByClassName('oneCharts')[0])
      this.oneCharts.setOption({
        color: ['#ffc333'],
        title: {
          text: `${this.townName}${this.villageName}每日用水量`,
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
          data: ['用水量'],
          x: 'center',
          y: 'top'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            data: x
          }
        ],
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 吨'
          }
        },
        series: [
          {
            name: '用水量',
            type: 'bar',
            data: y,
            barMaxWidth: 30
          }
        ]
      })
      window.addEventListener('resize', () => {
        this.oneCharts.resize()
      })
      // 将图表转成图片为打印做准备
      setTimeout(() => {
        imgBase64 = this.oneCharts.getDataURL()
        this.$refs.imgbox.src = imgBase64
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .regionBox {
    .rbTop {
      padding-top: 20px;
    }

    .oneCharts {
      height: 720px;
      width: 100%;
      padding-bottom: 10px;
    }

    .tableFather {
      background: #fff;
      position: absolute;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 20px 60px;
    }
  }
</style>
