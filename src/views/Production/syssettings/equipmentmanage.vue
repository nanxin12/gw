<template>
  <div class="stationBox">
    <div class="tableBox" v-show="open">
      <el-form :inline="true" :model="form" label-width="100px" label-position="right">
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
        <el-form-item label="设备名称/编号:" label-width="110px">
          <el-input v-model="form.condition" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData">查找</el-button>
          <el-button v-has="{type: 'add'}" type="primary" @click="addEquipment">添加</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="box">
        <div class="boxContent">
          <el-table :data="tableData" class="tables" stripe border :header-cell-style="tableHeaderColor">
            <el-table-column label="序号" align="center" width="60">
              <template slot-scope="scope">
                <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="code" label="设备编号" align="center"></el-table-column>
            <el-table-column prop="rtuName" label="设备名称" align="center"></el-table-column>
            <el-table-column label="监测类型" align="center">
              <template slot-scope="scope">
                <span style="margin-right: 5px;" v-for="item in scope.row.sensors" :key="item.id">{{item.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stationName" label="所属站点" align="center"></el-table-column>
            <el-table-column :formatter='formatter' label="创建时间" align="center"></el-table-column>
            <el-table-column prop="unit" label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-has="{type: 'update'}" type="success" style="margin: 5px" plain round size="mini" @click="updata(scope.row)">编辑</el-button>
                <el-button v-has="{type: 'delete'}" type="danger" style="margin: 5px" plain round size="mini" @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            align="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChanges"
            :current-page="form.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="form.eltotalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="mapBox" v-show="!open">
      <div id="map"></div>
      <div class="formBox">
        <div class="formTitle">
          <h3>{{typeNames}}</h3>
          <i class="el-icon-close" @click="cancel"></i>
        </div>
        <div class="forms">
          <el-form :model="equipmentForm" :rules="equipmentRules" ref="equipmentRef" label-width="85px" size="mini">
            <el-form-item label="设备编号:" prop="code">
              <el-input v-model="equipmentForm.code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备名称:" prop="rtuName">
              <el-input v-model="equipmentForm.rtuName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="所属站点:" prop="stationName">
              <el-input v-model="equipmentForm.stationName" placeholder="请选择地图上的站点" readonly></el-input>
            </el-form-item>
            <el-form-item label="监测类型:" prop="type" size="mini">
              <el-checkbox-group v-model="equipmentForm.type" @change="checkChange">
                <el-checkbox style="margin-right: 20px" v-for="item in checkList" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="流量计id:" prop="pos" size="mini" v-if="idShow">
              <el-input v-model="equipmentForm.pos" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备位置:" prop="location">
              <el-input type="textarea" :rows="2" v-model="equipmentForm.location" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit('equipmentRef')">提交</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'
import setTime from '@/assets/js/setTime'
export default {
  name: 'equipmentmanage',
  data () {
    return {
      idShow: false,
      typeNames: '',
      checkList: [
        { value: 'LIQUID_LEVEL', name: '液位' },
        { value: 'PRESSURE', name: '压力' },
        { value: 'BALANCE_OF_CL', name: '余氯' },
        { value: 'PH', name: 'PH' },
        { value: 'WATER_METER', name: '流量计' },
        { value: 'VOLTAGE', name: '电池电压' },
        { value: 'SWITCH01', name: '开关第一路' },
        { value: 'SWITCH02', name: '开关第二路' }
      ],
      stationList: [],
      pipeDomList: [],
      markerDomList: [],
      type: false,
      open: true,
      villageList: [],
      townList: [],
      form: {
        townId: null,
        villageId: null,
        stationId: null,
        condition: null,
        page: 1,
        size: 10,
        eltotalCount: 0
      },
      tableData: [],
      equipmentForm: {
        pos: null,
        location: null,
        id: null,
        rtuName: null,
        code: null,
        stationName: null,
        stationId: null,
        type: []
      },
      equipmentRules: {
        location: [{ required: true, message: '请输入', trigger: 'blur' }],
        rtuName: [{ required: true, message: '请输入', trigger: 'blur' }],
        pos: [{ required: true, message: '请输入', trigger: 'blur' }],
        code: [{ required: true, message: '请输入', trigger: 'blur' }],
        stationName: [{ required: true, message: '请在地图上选择站点', trigger: 'change' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.initMap()
    this.initTownOrVillage(640402000000, 1)
  },
  methods: {
    checkChange (val) {
      this.idShow = val.find(item => item === 'WATER_METER')
      console.log(this.idShow)
    },
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.type) {
            let data = JSON.parse(JSON.stringify(this.equipmentForm))
            delete data.id
            delete data.stationName
            let arr = data.type
            let pos = data.pos
            delete data.type
            delete data.pos
            let res = await this.$api.product.addEquipment(data, arr, pos)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.cancel()
              this.initData()
            } else this.$message.error('添加失败')
          } else {
            let data = JSON.parse(JSON.stringify(this.equipmentForm))
            delete data.stationName
            let arr = data.type
            delete data.type
            let res = await this.$api.product.putEquipment(data, arr)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.cancel()
              this.initData()
            } else this.$message.error('修改失败')
          }
        } else {
          this.$message.error('请完善信息')
          return false
        }
      })
    },
    cancel () {
      this.idShow = false
      this.open = true
      this.$refs.equipmentRef.resetFields()
    },
    initMap () {
      Amap().then(data => {
        this.mapobj = data[0]
        this.map = new this.mapobj.Map('map', {
          zoom: 10,
          center: [106.28, 36.14],
          doubleClickZoom: false,
          layers: [new this.mapobj.TileLayer.Satellite()]
        })
        this.map.plugin(['AMap.DistrictSearch', 'AMap.ToolBar', 'AMap.Scale', 'AMap.MapType', 'AMap.PolyEditor'], () => {
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
            this.initData()
          })
        })
      }, () => this.$message.error('地图加载失败请刷新页面'))
    },
    villageChange () {
      this.initStationData({ townId: this.form.townId, villageId: this.form.villageId })
    },
    townChange (val) {
      this.form.villageId = null
      this.initTownOrVillage(val, 2)
      this.initStationData({ townId: this.form.townId })
    },
    formTownChange (val) {
      this.equipmentForm.villageId = null
      this.initTownOrVillage(val, 3)
    },
    updata ({ code, id, location, rtuName, stationId, stationName, sensors }) {
      this.typeNames = '编辑设备'
      this.type = true
      let arr = []
      let pos = null
      sensors.forEach(item => {
        if (item.pos) {
          pos = item.pos
          this.idShow = true
        }
        arr.push(item.type)
      })
      this.equipmentForm = { code, id, location, rtuName, stationId, stationName, type: arr, pos }
      this.open = false
    },
    del (rtuId) {
      this.$confirm('此操作将删除设备及设备下的控制器', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.product.delEquipment({ rtuId })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    },
    addEquipment () {
      this.typeNames = '添加设备'
      this.type = false
      this.open = false
    },
    async initData () {
      // 列表数据
      let res = await this.$api.product.getEquipmentPage(this.form)
      if (res.code === 200) {
        res.data.list.forEach(item => {
          item.sensors.forEach(items => {
            this.checkList.forEach(itemss => {
              if (items.type === itemss.value) {
                items.name = itemss.name
              }
            })
          })
        })
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
      this.initStationData({ townId: this.form.townId, villageId: this.form.villageId })
      // 管道数据
      if (!this.pipeDomList.length) {
        let resss = await this.$api.product.getPipeData()
        if (resss.code === 200) {
          resss.data.forEach(item => {
            let pipe = new this.mapobj.Polyline({
              path: JSON.parse(item.coordinatePoint),
              isOutline: true,
              outlineColor: '#0a0ca9',
              borderWeight: 1,
              strokeColor: '#67c23a',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              strokeDasharray: [10, 5],
              lineJoin: 'round',
              lineCap: 'round',
              bubble: true
            })
            this.pipeDomList.push(pipe)
          })
          this.map.add(this.pipeDomList)
        } else this.$message.error('数据获取失败')
      }
    },
    async initTownOrVillage (code, type) {
      let res = await this.$api.organizeList.getRegionByCode({ code })
      if (res.code === 200) {
        if (type === 1) this.townList = res.data
        if (type === 2) this.villageList = res.data
      } else this.$message.error('数据获取失败')
    },
    // 获取站点数据
    async initStationData ({ townId = null, villageId = null }) {
      // 地图marker点数据
      let res = await this.$api.product.getStationNoPage({ townId, villageId })
      if (res.code === 200) {
        if (this.markerDomList.length) {
          this.map.remove(this.markerDomList)
          this.markerDomList = []
        }
        this.stationList = res.data
        this.stationList.forEach(item => {
          let { id, name } = item
          let marker = new this.mapobj.Marker({
            position: [Number(item.lng), Number(item.lat)],
            icon: item.images,
            offset: new this.mapobj.Pixel(-16, -16.5),
            cursor: 'pointer',
            extData: { id, name }
          })
          // let a = item.name.length
          // let num = 12 - (a * 6)
          marker.setLabel({
            offset: new this.mapobj.Pixel(0, -28),
            content: `<div>${item.name}</div>`,
            direction: 'center' // 设置文本标注方位
          })
          marker.on('click', this.markerClick)
          this.markerDomList.push(marker)
        })
        this.map.add(this.markerDomList)
      } else this.$message.error('数据获取失败')
    },
    // 表格转时间
    formatter (row) {
      if (row.time) return setTime({ date: row.time, number: 1000 })
      else return '暂无数据'
    },
    tableHeaderColor ({ rowIndex }) {
      if (Object.is(rowIndex, 0)) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
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
    markerClick (e) {
      let { name, id } = e.target.getExtData()
      this.equipmentForm.stationId = id
      this.equipmentForm.stationName = name
    },
    reset () {
      this.form.townId = null
      this.form.villageId = null
      this.form.stationId = null
      this.form.condition = null
      this.villageList = []
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .stationBox{
    width: 100%;
    height: 100%;
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
        .tables{
          margin-bottom: 20px;
        }
      }
    }
    .mapBox{
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      border-radius: 10px;
      position: relative;
      #map {
        width: 100%;
        height: 100%;
      }
      .formBox{
        background: #fff;
        position: absolute;
        width: 290px;
        right: 25px;
        top: 150px;
        z-index: 555;
        border-radius: 8px;
        .formTitle{
          height: 40px;
          display: flex;
          justify-content: space-between;
          background: #4292ff;
          align-items: center;
          color: #fff;
          padding: 0 20px;
          box-sizing: border-box;
          border-radius: 8px 8px 0 0;
          h3{
            font-size: 18px;
          }
          margin-bottom: 20px;
        }
        .forms{
          padding: 0 23px 2px 23px;
          box-sizing: border-box;
        }
      }
    }
  }
  /deep/ .amap-marker-label{
    border-color: #ccc!important;
    border-radius: 5px!important;
    font-weight: 700!important;
  }
</style>
