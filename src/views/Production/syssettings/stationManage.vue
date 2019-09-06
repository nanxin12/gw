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
            <el-select v-model="form.villageId" placeholder="请选择">
              <el-option v-for="item in villageList" :label="item.positionName" :value="item.code" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点类型:">
            <el-select v-model="form.typeId" placeholder="请选择">
              <el-option v-for="item in typeList" :label="item.typeName" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点名称:">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData">查找</el-button>
            <el-button v-has="{type: 'add'}" type="primary" @click="addStation">添加</el-button>
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
              <el-table-column prop="name" label="站点名称" align="center"></el-table-column>
              <el-table-column prop="typeName" label="站点类型" align="center"></el-table-column>
              <el-table-column prop="location" label="地址" align="center"></el-table-column>
              <el-table-column label="坐标" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.lat}},{{scope.row.lng}}</span>
                </template>
              </el-table-column>
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
            <h3>{{operationName}}</h3>
            <i class="el-icon-close" @click="cancel"></i>
          </div>
          <div class="forms">
            <el-form :model="stationForm" :rules="stationRules" ref="stationRef" label-width="85px" size="mini">
              <el-form-item label="站点名称:" prop="name">
                <el-input v-model="stationForm.name" placeholder="请输入" @blur="changeStationName"></el-input>
              </el-form-item>
              <el-form-item label="所属乡镇:" prop="townId">
                <el-select v-model="stationForm.townId" placeholder="请选择" @change="formTownChange">
                  <el-option v-for="item in townList" :label="item.positionName" :value="item.code" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属村:" prop="villageId">
                <el-select v-model="stationForm.villageId" placeholder="请选择">
                  <el-option v-for="item in formVillageList" :label="item.positionName" :value="item.code" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="站点类型:" prop="typeId">
                <el-select v-model="stationForm.typeId" placeholder="请选择" @change="stationTypeMsg">
                  <el-option v-for="item in typeList" :label="item.typeName" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="站点坐标:" prop="latLng">
                <el-input v-model="stationForm.latLng" placeholder="点击地图选择站点位置" readonly></el-input>
              </el-form-item>
              <el-form-item label="站点地址:" prop="location">
                <el-input type="textarea" :rows="2" v-model="stationForm.location" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('stationRef')">提交</el-button>
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
  name: 'stationManage',
  data () {
    return {
      operationName: '',
      pipeDomList: [],
      markerDomList: [],
      markerDataList: [],
      type: false,
      stationImg: null,
      addStationDom: null,
      open: true,
      formVillageList: [],
      villageList: [],
      townList: [],
      typeList: [],
      form: {
        townId: null,
        villageId: null,
        typeId: null,
        name: null,
        page: 1,
        size: 10,
        eltotalCount: 0
      },
      tableData: [],
      stationForm: {
        location: null,
        id: null,
        latLng: null,
        name: null,
        townId: null,
        typeId: null,
        villageId: null
      },
      stationRules: {
        location: [{ required: true, message: '请输入', trigger: 'blur' }],
        latLng: [{ required: true, message: '请点击地图选择坐标', trigger: 'change' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        townId: [{ required: true, message: '请选择', trigger: 'change' }],
        typeId: [{ required: true, message: '请选择', trigger: 'change' }],
        villageId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.initType()
    this.initMap()
    this.initTownOrVillage(640402000000, 1)
  },
  methods: {
    changeStationName () {
      if (this.addStationDom) this.setStationTxt()
    },
    stationTypeMsg (val) {
      if (this.type) {
        this.markerDomList.forEach(item => {
          if (item.getExtData().id === this.stationForm.id) {
            let imgs = this.typeList.find(item => item.id === val).images
            item.setIcon(imgs)
          }
        })
      } else {
        if (!this.stationImg) {
          this.stationImg = this.typeList.find(item => item.id === val).images
        } else {
          let imgs = this.typeList.find(item => item.id === val).images
          this.addStationDom.setIcon(imgs)
        }
      }
    },
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.type) {
            let data = JSON.parse(JSON.stringify(this.stationForm))
            delete data.id
            data.lat = data.latLng.split(',')[0]
            data.lng = data.latLng.split(',')[1]
            delete data.latLng
            let res = await this.$api.product.addStation(data)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.cancel()
              this.initData()
            } else this.$message.error('添加失败')
          } else {
            let data = JSON.parse(JSON.stringify(this.stationForm))
            data.lat = data.latLng.split(',')[0]
            data.lng = data.latLng.split(',')[1]
            delete data.latLng
            let res = await this.$api.product.upStation(data)
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
      this.open = true
      this.$refs.stationRef.resetFields()
      if (this.type) {
        this.markerDomList.forEach(item => {
          item.off('click', this.upDataClick)
        })
      } else {
        this.stationImg = null
        this.map.remove(this.addStationDom)
        this.addStationDom = null
        this.map.off('click', this.addStationMarker)
      }
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
    townChange (val) {
      this.form.villageId = null
      this.initTownOrVillage(val, 2)
    },
    formTownChange (val) {
      this.stationForm.villageId = null
      this.initTownOrVillage(val, 3)
    },
    async updata ({ id, images, lat, lng, location, name, townId, typeId, villageId }) {
      this.operationName = '编辑站点'
      townId = Number(townId)
      let res = await this.$api.organizeList.getRegionByCode({ code: townId })
      if (res.code === 200) {
        this.formVillageList = res.data
        this.stationForm = { id, images, latLng: lat + ',' + lng, location, name, townId, typeId, villageId: Number(villageId) }
        this.markerDomList.forEach(item => {
          item.on('click', this.upDataClick)
        })
        this.type = true
        this.open = false
        this.markerDomList.forEach(item => {
          if (item.getExtData().id === id) {
            item.setDraggable(true)
            return false
          }
        })
      } else this.$message.error('数据获取失败')
    },
    del (id) {
      this.$confirm('此操作将删除站点及站点下的设备', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.product.delStation({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    },
    async upDataClick (e) {
      let data = e.target.getExtData()
      data.townId = Number(data.townId)
      data.villageId = Number(data.villageId)
      let res = await this.$api.organizeList.getRegionByCode({ code: Number(data.townId) })
      if (res.code === 200) {
        this.formVillageList = res.data
        this.markerDomList.forEach(item => {
          item.setDraggable(false)
        })
        e.target.setDraggable(true)
        this.stationForm = data
      } else this.$message.error('数据获取失败')
    },
    addStation () {
      this.operationName = '添加站点'
      this.type = false
      this.open = false
      this.map.on('click', this.addStationMarker)
    },
    addStationMarker (e) {
      if (!this.stationImg) return this.$message.warning('请先选择站点类型')
      if (!this.addStationDom) {
        this.addStationDom = new this.mapobj.Marker({
          position: e.lnglat,
          icon: this.stationImg,
          offset: new this.mapobj.Pixel(-16, -16.5),
          // 设置是否可以拖拽
          draggable: true,
          cursor: 'pointer'
        })
        if (this.stationForm.name) this.setStationTxt()
        this.stationForm.latLng = `${e.lnglat.lat},${e.lnglat.lng}`
        this.addStationDom.on('dragend', this.stationDragend)
        this.map.add(this.addStationDom)
      }
    },
    setStationTxt () {
      let a = this.stationForm.name.length
      let num = 12 - (a * 6)
      this.addStationDom.setLabel({
        offset: new this.mapobj.Pixel(num, -22),
        content: `<div>${this.stationForm.name}</div>`
      })
    },
    stationDragend (e) {
      this.stationForm.latLng = `${e.lnglat.lat},${e.lnglat.lng}`
    },
    async initData () {
      // 列表数据
      let res = await this.$api.product.getStationPage(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
      // 地图marker点数据
      let ress = await this.$api.product.getStationNoPage()
      if (ress.code === 200) {
        if (this.markerDomList.length) {
          this.map.remove(this.markerDomList)
          this.markerDomList = []
        }
        this.markerDataList = ress.data
        this.markerDataList.forEach(item => {
          let { id, images, lat, lng, location, name, townId, typeId, villageId } = item
          let marker = new this.mapobj.Marker({
            position: [Number(item.lng), Number(item.lat)],
            icon: item.images,
            offset: new this.mapobj.Pixel(-16, -16.5),
            // 设置是否可以拖拽
            cursor: 'pointer',
            extData: { id, images, latLng: lat + ',' + lng, location, name, townId: Number(townId), typeId, villageId: Number(villageId) }
          })
          // let a = item.name.length
          // let num = 12 - (a * 6)
          marker.setLabel({
            offset: new this.mapobj.Pixel(0, -28),
            content: `<div class='info'>${item.name}</div>`,
            direction: 'center' // 设置文本标注方位
          })
          marker.on('dragend', this.stationDragend)
          this.markerDomList.push(marker)
        })
        this.map.add(this.markerDomList)
      }
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
    async initType () {
      let res = await this.$api.product.getStationType()
      if (res.code === 200) {
        this.typeList = res.data
      } else this.$message.error('数据获取失败')
    },
    async initTownOrVillage (code, type) {
      let res = await this.$api.organizeList.getRegionByCode({ code })
      if (res.code === 200) {
        if (type === 1) this.townList = res.data
        if (type === 2) this.villageList = res.data
        if (type === 3) this.formVillageList = res.data
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
    reset () {
      this.form.townId = null
      this.form.villageId = null
      this.form.typeId = null
      this.form.name = null
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
        height: 410px;
        width: 290px;
        right: 25px;
        top: 50%;
        margin-top: -205px;
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
