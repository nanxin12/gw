<template>
  <!-- 实时报警 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form orm
        :inline="true"
        :model="form"
        label-width="80px"
        label-position="right">
        <el-form-item label="所属乡镇:">
          <el-select v-model="form.townId"
            placeholder="请选择"
            @change="townChange">
            <el-option v-for="item in townList"
              :label="item.positionName"
              :value="item.code"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村:">
          <el-select v-model="form.villageId"
            placeholder="请选择"
            @change="villageChange">
            <el-option v-for="item in villageList"
              :label="item.positionName"
              :value="item.code"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属站点:">
          <el-select v-model="form.stationId"
            placeholder="请选择">
            <el-option v-for="item in stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监测类型:">
          <el-select v-model="form.sensorTypes"
            multiple
            style="width:400px;"
            placeholder="请选择">
            <el-option value="LIQUID_LEVEL"
              label="液位">液位</el-option>
            <el-option value="PRESSURE"
              label="压力">压力</el-option>
            <el-option value="BALANCE_OF_CL"
              label="余氯">余氯</el-option>
            <el-option value="PH"
              label="PH值">PH值</el-option>
            <el-option value="VOLTAGE"
              label="电压">电压</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称/编号:"
          label-width="110px">
          <el-input v-model="form.condition"
            placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="initdata">查找</el-button>
          <el-button type="primary"
            @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 中间内容 -->
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          border
          :header-cell-style="tableHeaderColor">
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code"
            label="设备编号"
            align="center"></el-table-column>
          <el-table-column prop="rtuName"
            label="设备名称"
            align="center"></el-table-column>
          <el-table-column prop="location"
            label="所属站点"
            align="center"></el-table-column>
          <el-table-column prop="type"
            label="监测类型"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'LIQUID_LEVEL'">液位</span>
              <span v-if="scope.row.type === 'PRESSURE'">压力</span>
              <span v-if="scope.row.type === 'BALANCE_OF_CL'">余氯</span>
              <span v-if="scope.row.type === 'PH'">PH值</span>
              <span v-if="scope.row.type === 'VOLTAGE'">电压</span>
              <span v-if="scope.row.type === 'SWITCH01'">开关第一路</span>
              <span v-if="scope.row.type === 'SWITCH02'">开关第二路</span>
            </template>
          </el-table-column>
          <el-table-column prop="value"
            label="报警数据"
            align="center">
            <template slot-scope="scope">
              <span v-for="item in company"
                :key="item.id"
                v-show="scope.row.type === item.typeEnum">
                <span style="color:red;margin-right:4px;" v-if="scope.row.value === 'ABNORMAL'">不正常</span>
                <span style="color:red;margin-right:4px;" v-else-if="scope.row.value === 'NORMAL'">正常</span>
                <span style="color:red;margin-right:4px;" v-else>{{scope.row.value}}<span>{{item.nuit}}</span></span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="standardValues"
            label="标准值"
            align="center"></el-table-column>
          <el-table-column prop="time"
            :formatter="formatter"
            label="报警时间"
            align="center"></el-table-column>
          <el-table-column prop="totalPrice"
            label="持续时间"
            align="center">
            <template slot-scope="scope">
              <!-- <div>{{scope.row.time}}</div> -->
              <div>{{duration(scope.row.time)}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'nowwarn',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      dialog: false,
      userInfo: {},
      form: {
        townId: null,
        villageId: null,
        stationId: null,
        condition: null,
        sensorTypes: null
      },
      newDate: null,
      townList: [],
      villageList: [],
      stationList: [],
      // 定时器
      timer: null,
      company: [
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
      ]
    }
  },
  methods: {
    duration (val) {
      if (this.newDate == null) {
        return `0天 - 0时 - 0分 - 0秒`
      } else {
        let oldTime = val * 1000
        let timediff = Math.round((this.newDate - oldTime) / 1000)
        // 获取还剩多少天
        let day = parseInt(timediff / 3600 / 24)
        // 获取还剩多少小时
        let hour = parseInt(timediff / 3600 % 24)
        // 获取还剩多少分钟
        let minute = parseInt(timediff / 60 % 60)
        // 获取还剩多少秒
        let second = timediff % 60
        let aa = `${day}天 - ${hour}时 - ${minute}分 - ${second}秒`
        // day === 0 ? aa = `${hour}时 - ${minute}分 - ${second}秒` : aa = `${day}天 - ${hour}时 - ${minute}分 - ${second}秒`
        // hour === 0 ? aa = `${minute}分 - ${second}秒` : aa = `${hour}时 - ${minute}分 - ${second}秒`
        // minute === 0 ? aa = `${second}秒` : aa = `${minute}分 - ${second}秒`

        return aa
      }
    },
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000 })
      } else {
        return '暂无数据'
      }
    },
    initdata (val) {
      val === 'query' ? this.page = 1 : this.page = this.page
      // areaId: 640402000000,
      this.$api.product.getRealTimeAlarmData({ page: this.page, size: this.limit, townId: this.form.townId, villageId: this.form.villageId, stationId: this.form.stationId, condition: this.form.condition, sensorTypes: this.form.sensorTypes.join(',') }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.totalCount
        } else {
          this.$message.error(res.msg)
        }
      })
      this.initStationData({})
    },
    // 表头样式改变
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    // 改变每页显示条数
    handleSizeChange (val) {
      this.limit = val
      this.initdata()
    },
    // 改变页码
    handleCurrentChanges (val) {
      this.page = val
      this.initdata()
    },
    async initTownOrVillage (code, type) {
      let res = await this.$api.organizeList.getRegionByCode({ code }, 'http://192.168.1.189:84/permission')
      if (res.code === 200) {
        if (type === 1) this.townList = res.data
        if (type === 2) this.villageList = res.data
      } else this.$message.error('数据获取失败')
    },
    // 获取站点数据
    async initStationData ({ townId = null, villageId = null }) {
      let res = await this.$api.product.getStationNoPage({ townId, villageId })
      if (res.code === 200) {
        this.stationList = res.data
      }
    },
    townChange (val) {
      this.form.villageId = null
      this.form.stationId = null
      this.initTownOrVillage(val, 2)
      this.initStationData({ townId: this.form.townId })
    },
    villageChange () {
      this.initStationData({ townId: this.form.townId, villageId: this.form.villageId })
    },
    reset () {
      this.form.townId = null
      this.form.villageId = null
      this.form.stationId = null
      this.form.condition = null
      this.form.sensorTypes = []
      this.villageList = []
      this.initdata()
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('userMsg'))
    this.initdata()
    this.initTownOrVillage(640402000000, 1)
  },
  created () {
    // 把定时器赋值
    this.timer = setInterval(() => {
      this.newDate = Date.now()
    }, 1000)
  },
  // 页面离开之前
  beforeDestroy () {
    clearInterval(this.timer) // 关闭定时器
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 115px;
}
.box {
  position: relative;
  width: 100%;
  .boxContent {
    width: 100%;
    border-radius: 5px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    position: absolute;
    .tables {
      margin-bottom: 20px;
    }
  }
}
.inner /deep/ .el-dialog__body {
  padding: 25px 60px 10px !important;
}
.el-select {
  width: 100%;
}
.demo-ruleForm .el-date-editor {
  width: 100%;
}
.dialog-footer .el-button {
  margin: 0 0 0 10px !important;
  float: right;
}
.inner /deep/ .el-dialog__footer {
  padding: 10px 60px 40px !important;
}
</style>
