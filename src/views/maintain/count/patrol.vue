<template>
  <div class="box">
    <div class="boxHeader">
      <div class="top">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="巡检周期:">
            <el-select v-model="formInline.cycle" placeholder="请选择">
              <el-option label="天" value="DAY"></el-option>
              <el-option label="周" value="WEEK"></el-option>
              <el-option label="月" value="MONTH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检员:">
            <el-select v-model="formInline.userId" placeholder="请选择" style="width: 190px">
              <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检时间:">
            <el-date-picker
              value-format="timestamp"
              v-model="formInline.days"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData('query')">查找</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="danger" @click="allDel">批量删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="boxs">
      <div class="boxContents">
        <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor"
                  @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{(formInline.pageNum-1)*formInline.pageSize+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="siteName" label="巡检区域" align="center"></el-table-column>
          <el-table-column prop="userName" label="巡检员" align="center"></el-table-column>
          <el-table-column prop="planName" label="计划名称" align="center"></el-table-column>
          <el-table-column prop="startDate" :formatter='formatter' label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endDate" :formatter='formatter' label="结束时间" align="center"></el-table-column>
          <el-table-column prop="cycle" label="巡检周期" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.cycle === 'DAY'">天</span>
              <span v-if="scope.row.cycle === 'WEEK'">周</span>
              <span v-if="scope.row.cycle === 'MONTH'">月</span>
            </template>
          </el-table-column>
          <el-table-column prop="objs" :formatter="objFormatter" label="巡检对象" align="center"></el-table-column>
          <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
          <el-table-column prop="createTime" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" style="margin: 5px" size="mini" plain round @click="details(scope.row)">详情</el-button>
              <el-button type="danger" style="margin: 5px" size="mini" plain round @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="formInline.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="formInline.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="formInline.eltotalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="mapDig" width="70%" title="任务详情">
      <div id="map">
        <el-form class="forms" size="mini" label-width="80px"  :model="detailsForm">
          <el-form-item label="计划名称:">
            <el-input v-model="detailsForm.planName" readonly></el-input>
          </el-form-item>
          <el-form-item label="任务时间:">
            <el-input v-model="detailsForm.time" readonly></el-input>
          </el-form-item>
          <el-form-item label="区域面积:">
            <el-input v-model="detailsForm.scope" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'
import setTime from '@/assets/js/setTime'
export default {
  name: 'patrol',
  data () {
    return {
      delList: [],
      detailsForm: {
        planName: null,
        time: null,
        scope: null
      },
      region: false,
      mapOk: false,
      mapobj: '',
      map: '',
      mapDig: false,
      objList: [],
      userList: [],
      eltotalCount: 0,
      limit: 10,
      page: 1,
      formInline: {
        userId: null,
        cycle: null,
        days: [],
        pageNum: 1,
        pageSize: 10,
        eltotalCount: 0
      },
      tableData: []
    }
  },
  created () {
    this.initUser()
    this.initData()
    this.initObj()
  },
  methods: {
    initMap () {
      let p = new Promise((resolve, reject) => {
        Amap().then(data => {
          this.mapobj = data[0]
          this.map = new this.mapobj.Map('map', {
            zoom: 10,
            center: [106.28, 36.14],
            doubleClickZoom: false,
            layers: [new this.mapobj.TileLayer.Satellite()]
          })
          this.map.plugin(['AMap.DistrictSearch', 'AMap.ToolBar', 'AMap.Scale', 'AMap.MapType'], () => {
            this.map.addControl(new this.mapobj.ToolBar({}))
            this.map.addControl(new this.mapobj.Scale({}))
            this.map.addControl(new this.mapobj.MapType({
              defaultType: 0
            }))
            new this.mapobj.DistrictSearch({
              extensions: 'all',
              subdistrict: 0,
              level: 'district'
            }).search('原州区', (status, result) => {
              // 外多边形坐标数组和内多边形坐标数组
              let outer = [
                new this.mapobj.LngLat(-360, 90, true),
                new this.mapobj.LngLat(-360, -90, true),
                new this.mapobj.LngLat(360, -90, true),
                new this.mapobj.LngLat(360, 90, true)
              ]
              let holes = result.districtList[0].boundaries
              let pathArray = [outer]
              pathArray.push.apply(pathArray, holes)
              let polygon = new this.mapobj.Polygon({
                pathL: pathArray,
                strokeColor: '#86c8f8',
                strokeWeight: 5,
                fillColor: '#000',
                fillOpacity: 0.7
              })
              polygon.setPath(pathArray)
              this.map.add(polygon)
              resolve('23332')
            })
          })
        }, () => this.$message.error('地图加载失败请刷新页面'))
      })
      return p
    },
    async details ({ id, startDate, endDate, planName }) {
      let res = await this.$api.maintain.getTaskById(id)
      if (res.code === 200) {
        this.detailsForm.scope = res.data[1].scope
        this.detailsForm.planName = planName
        this.detailsForm.time = `${setTime({ date: startDate, number: 1000, type: 2 })} - ${setTime({ date: endDate, number: 1000, type: 2 })}`
        let arr = JSON.parse(res.data[0].coordinates)
        this.mapDig = true
        if (!this.map) {
          this.initMap().then(() => {
            this.region = new this.mapobj.Polygon({
              path: arr,
              strokeColor: '#FF33FF',
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              fillColor: '#1791fc',
              zIndex: 50
            })
            this.map.add(this.region)
            this.map.setFitView([this.region])
          })
        } else {
          this.region.setPath(arr)
          this.map.setFitView([this.region])
        }
      } else this.$message.error('任务详情获取失败')
    },
    del (val) {
      this.delList = []
      this.delList.push(val)
      this.allDel()
    },
    // 遍历出巡检对象
    objFormatter (row) {
      let arr = []
      let arrs = row.objs.split(',')
      arrs.forEach(item => {
        arr.push(this.objList.find(items => Number(item) === items.id).name + ' ')
      })
      return arr
    },
    async initObj () {
      let res = await this.$api.maintain.getPlanObj()
      if (res.code === 200) {
        this.objList = res.data
      } else this.$message.error('巡检对象获取失败')
    },
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000, type: 2 })
      else return '暂无数据'
    },
    async initUser () {
      let res = await this.$api.maintain.getUsers()
      if (res.code === 200) {
        this.userList = []
        res.data.forEach(item => {
          item.children.forEach(items => {
            this.userList.push(items)
          })
        })
      } else this.$message.error('巡检对象获取失败')
    },
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let data = JSON.parse(JSON.stringify(this.formInline))
      data.startDate = data.days[0]
      data.endDate = data.days[1]
      delete data.days
      let res = await this.$api.maintain.getTask(data)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.formInline.eltotalCount = res.data.total
      } else this.$message.error('数据获取失败')
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    onSubmit () {
      console.log('submit!')
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.formInline.pageSize = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.formInline.pageNum = values
      this.initData()
    },
    handleSelectionChange (val) {
      this.delList = []
      val.forEach(item => {
        this.delList.push(item.id)
      })
    },
    async allDel () {
      let res = await this.$api.maintain.delTaskById({ ids: this.delList })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.initData()
      } else this.$message.error('删除失败')
    },
    reset () {
      this.formInline.pageNum = 1
      this.formInline.userId = null
      this.formInline.cycle = null
      this.formInline.days = []
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .boxs {
    position: relative;
    width: 100%;
    .boxContents {
      width: 100%;
      border-radius: 5px;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      position: absolute;
      .tables{
        margin-bottom: 20px;
      }
    }
  }
  .box{
    width: 100%;
    .boxHeader{
      padding: 15px;
      .el-form-item{
        margin: 0 30px 15px 0;
      }
    }
    .boxContent{
      min-height: 593px;
      .tableBox{
        border-radius: 10px;
        background: #fff;
        padding: 20px;
        margin-bottom: 30px;
      }
    }
  }
  #map{
    width: 100%;
    height: 600px;
    background: #fff;
    margin-bottom: 20px;
    position: relative;
    .forms{
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 999;
      background: #fff;
      padding: 20px;
      border-radius: 10px 0 0 0;
    }
  }
</style>
