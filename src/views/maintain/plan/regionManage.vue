<template>
  <div class="mapBpx">
    <div class="treeBox" v-show="listShow">
      <div class="treeBoxTop">
        <h3>区域列表</h3>
        <div class="searchBox">
          <el-input v-model="regionName" size="mini" style="margin-right: 10px" placeholder="请输入区域名称"></el-input>
<!--          <el-button v-has="{type: 'add'}" type="primary" size="mini" @click="addpolyline">添加</el-button>-->
          <el-button type="primary" size="mini" @click="addRegion">添加</el-button>
        </div>
      </div>
      <ul class="treeBoxContent">
        <li class="menuBox" v-for="(item,index) in regionList" :key="item.id" :class="{borColor:colorIndex === index}">
          <p :title="item.name" @click="lookRegion(index,item.name,item.scope)">{{item.name}}</p>
<!--          <div v-has="{type: 'update'}" title="编辑管网" class="updataBox" @click="updataRegion(index, item.name, item.pipeLength, item.id)">-->
<!--            <i class="el-icon-edit-outline"></i>-->
<!--          </div>-->
          <div title="编辑管网" class="updataBox" @click="updataRegion(index, item.name, item.scope, item.id)">
            <i class="el-icon-edit-outline"></i>
          </div>
<!--          <div v-has="{type: 'delete'}" title="删除管网" class="deleteBox" @click="deleteRegion(item.id)">-->
<!--            <i class="el-icon-delete"></i>-->
<!--          </div>-->
          <div title="删除管网" class="deleteBox" @click="deleteRegion(item.id)">
            <i class="el-icon-delete"></i>
          </div>
        </li>
      </ul>
    </div>
    <div id="map"></div>
    <div class="btnList" v-show="btnShow">
      <div class="btnListTiele">
        <h3>{{title}}</h3>
      </div>
      <div class="btnListTop">
        <p>{{describe}}</p>
      </div>
      <div class="btnListContent">
        <el-form :model="regionForm" :rules="regionFormRules" ref="pipeFormRef" class="demo-form-inline" label-width="90px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="区域名称:" prop="name">
                <el-input v-model="regionForm.name" placeholder="请输入管网名称" size="mini" :readonly="lookRegionShow"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="区域面积:" prop="scope" style="position: relative;">
                <el-input v-model="regionForm.scope" size="mini" readonly></el-input>
                <span style="display: block; width: 50px; position: absolute;left: 160px;top: 0">平方米</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="btnListBottom" v-show="!lookRegionShow">
        <el-button type="primary" :disabled="startClick" size="mini" @click="sumbit('pipeFormRef')">提交</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'

export default {
  name: 'regionManage',
  data () {
    let pipeLong = (rule, value, callback) => {
      if (!value) {
        callback(new Error('巡检区域不能为空'))
      } else {
        if (value <= 0) {
          callback(new Error('巡检区域不能为0'))
        } else {
          callback()
        }
      }
    }
    return {
      regionDomList: [],
      polyEditor: null,
      region: null,
      markerDomList: [],
      markerDataList: [],
      colorIndex: null,
      lookRegionShow: false,
      alongList: [],
      startClick: false,
      regionName: '',
      title: '',
      regionList: [],
      btnShow: false,
      listShow: true,
      mapobj: '',
      map: '',
      regionForm: {
        id: null,
        name: '',
        scope: 0,
        coordinates: null
      },
      regionFormRules: {
        name: [{ required: true, message: '请输入管网名称', trigger: 'blur' }],
        scope: [ { required: true, validator: pipeLong, trigger: 'change' } ]
      },
      describe: ''
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    updataRegion (index, name, scope, id) {
      this.colorIndex = index
      this.regionDomList.forEach(item => {
        console.log(item.getExtData().id)
        if (item.getExtData().id === index) {
          item.setOptions({ strokeColor: '#f1e22d' })
          this.region = item
          this.polyEditorBind()
          this.openShow()
          this.title = '编辑区域'
          this.describe = '点击虚点增加位置，点击高亮点撤销位置，拖拽高亮点改变位置，双击完成编辑。'
          this.regionForm.name = name
          this.regionForm.scope = scope
          this.regionForm.id = id
          this.map.setFitView([item])
        } else item.setOptions({ strokeColor: '#FF33FF' })
      })
    },
    polyEditorBind () {
      this.polyEditor = new this.mapobj.PolyEditor(this.map, this.region)
      this.polyEditor.open()
      this.map.on('dblclick', this.dblclickRegion)
      this.polyEditor.on('addnode', this.regionFormScope)
      this.polyEditor.on('adjust', this.regionFormScope)
      this.polyEditor.on('removenode', this.regionFormScope)
    },
    regionFormScope () {
      this.regionForm.scope = this.region.getArea()
    },
    cancel () {
      if (this.title === '新增区域') {
        if (this.region) {
          this.polyEditor.close()
          this.map.remove(this.region)
          this.region = null
        } else {
          if (this.markerDomList.length) {
            this.map.remove(this.markerDomList)
            this.markerDomList = []
            this.markerDataList = []
          }
          this.map.off('click', this.clickRegion)
          this.map.off('rightclick', this.rightRegion)
        }
      } else {
        this.polyEditor.close()
        this.map.remove(this.region)
        this.region = null
        this.initRegion()
      }
      this.listShow = true
      this.btnShow = false
      this.startClick = false
      // this.initRegion()
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
            this.initRegion()
          })
        })
      }, () => this.$message.error('地图加载失败请刷新页面'))
    },
    async initRegion () {
      let res = await this.$api.maintain.getRegionHas()
      if (res.code === 200) {
        if (this.regionDomList.length) {
          this.map.remove(this.regionDomList)
          this.regionDomList = []
        }
        this.regionName = ''
        this.alongList = res.data
        this.regionList = JSON.parse(JSON.stringify(res.data))
        res.data.forEach((item, index) => {
          let region = new this.mapobj.Polygon({
            path: JSON.parse(item.coordinates),
            strokeColor: '#FF33FF',
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            fillColor: '#1791fc',
            zIndex: 50,
            extData: { id: index }
          })
          this.regionDomList.push(region)
        })
        this.map.add(this.regionDomList)
      }
    },
    clickRegion (e) {
      if (this.markerDataList.length === 2) {
        let x = e.lnglat.getLng()
        let y = e.lnglat.getLat()
        this.markerDataList.push([x, y])
        this.region = new this.mapobj.Polygon({
          path: this.markerDataList,
          strokeColor: '#FF33FF',
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50
        })
        this.regionForm.scope = this.region.getArea()
        this.map.add(this.region)
        this.map.remove(this.markerDomList)
        this.markerDomList = []
        this.markerDataList = []
        this.map.off('click', this.clickRegion)
        this.map.off('rightclick', this.rightRegion)
        this.describe = '点击虚点增加位置，点击高亮点撤销位置，拖拽高亮点改变位置，双击完成添加。'
        this.polyEditorBind()
        return false
      }
      if (this.markerDataList.length < 2) {
        let x = e.lnglat.getLng()
        let y = e.lnglat.getLat()
        this.markerDataList.push([x, y])
        let marker = new this.mapobj.Marker({
          position: [x, y],
          offset: new this.mapobj.Pixel(-9.5, -33)
        })
        this.map.add(marker)
        this.markerDomList.push(marker)
      }
    },
    dblclickRegion () {
      if (this.region) {
        this.polyEditor.close()
        this.startClick = false
        let arrs = []
        this.region.getPath().forEach(item => {
          let arr = []
          arr.push(item.lng)
          arr.push(item.lat)
          arrs.push(arr)
        })
        this.regionForm.coordinates = arrs
        this.map.off('dblclick', this.dblclickRegion)
      }
    },
    rightRegion () {
      if (this.markerDataList.length) {
        let i = this.markerDomList.length - 1
        this.map.remove(this.markerDomList[i])
        this.markerDomList.splice(i, 1)
        this.markerDataList.splice(i, 1)
      }
    },
    lookRegion (index, name, scope) {
      this.colorIndex = index
      this.regionDomList.forEach(item => {
        console.log(item.getExtData().id)
        if (item.getExtData().id === index) {
          item.setOptions({ strokeColor: '#f1e22d' })
          this.lookRegionShow = true
          this.btnShow = true
          this.title = '查看区域'
          this.describe = ''
          this.regionForm.name = name
          this.regionForm.scope = scope
          this.map.setFitView([item])
        } else item.setOptions({ strokeColor: '#FF33FF' })
      })
    },
    openShow () {
      this.lookRegionShow = false
      this.listShow = false
      this.btnShow = true
      this.startClick = true
    },
    addRegion () {
      this.$refs['pipeFormRef'].resetFields()
      this.title = '新增区域'
      this.openShow()
      this.describe = '鼠标左键点击地图添加3个区域基准点，右键撤销到上一位置。'
      this.map.on('click', this.clickRegion)
      this.map.on('rightclick', this.rightRegion)
    },
    sumbit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.regionForm))
          if (this.title === '新增区域') delete data.id
          data.coordinates = JSON.stringify(data.coordinates)
          let res = await this.$api.maintain.addRegion(data)
          if (res.code === 200) {
            if (this.title === '新增区域') this.$message.success('添加成功')
            else this.$message.success('编辑成功')
            this.listShow = true
            this.btnShow = false
            this.startClick = false
            this.map.remove(this.region)
            this.region = null
            this.initRegion()
          } else {
            if (this.title === '新增区域') this.$message.error('添加失败')
            else this.$message.error('编辑失败')
          }
        } else return this.$message.error('请完善管网信息')
      })
    },
    deleteRegion (id) {
      this.$confirm('此操作将删除区域', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.maintain.delRegion(id)
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initRegion()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    }
  },
  watch: {
    regionName (newVal) {
      this.regionList = this.alongList
      this.regionList = this.regionList.filter(item => {
        let show = 0
        if (newVal) {
          show = item.name.indexOf(newVal)
        }
        return show >= 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mapBpx {
    width: 100%;
    height: 100%;
    display: flex;
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    position: relative;

    .treeBox {
      width: 250px;
      height: 100%;
      border: 1px solid #ddd;
      border-radius: 3px;
      box-sizing: border-box;
      margin-right: 18px;
      overflow-y: auto;

      .treeBoxTop {
        padding: 0 10px;
        margin-bottom: 10px;

        h3 {
          font-size: 18px;
          font-weight: 700;
          height: 50px;
          line-height: 50px;
        }
        .searchBox {
          display: flex;
        }
      }

      .treeBoxContent {
        display: flex;
        flex-direction: column;

        li {
          height: 26px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-left: 3px solid transparent;
          box-sizing: border-box;
          cursor: pointer;

          p {
            height: 100%;
            width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .borColor{
          border-color: #4292FF;
        }
      }
    }

    #map {
      flex: 1;
    }

    .btnList {
      padding: 10px;
      position: absolute;
      bottom: 15px;
      left: 50%;
      background: #fff;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-left: -214px;

      h3 {
        font-size: 16px;
      }

      .btnListBottom {
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
