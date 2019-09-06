<template>
  <div class="mapBpx">
    <div class="treeBox" v-show="listShow">
      <div class="treeBoxTop">
        <h3>管网列表</h3>
        <div class="searchBox">
          <el-input v-model="pipeName" size="mini" style="margin-right: 10px" placeholder="请输入管网名称"></el-input>
          <el-button v-has="{type: 'add'}" type="primary" size="mini" @click="addpolyline">添加</el-button>
        </div>
      </div>
      <ul class="treeBoxContent">
        <li class="menuBox" v-for="(item,index) in pipeList" :key="item.id" :class="{borColor:colorIndex === index}">
          <p :title="item.name" @click="lookPipe(index,item.name,item.pipeLength)">{{item.name}}</p>
          <div v-has="{type: 'update'}" title="编辑管网" class="updataBox" @click="updatapolyline(index, item.name, item.pipeLength, item.id)">
            <i class="el-icon-edit-outline"></i>
          </div>
          <div v-has="{type: 'delete'}" title="删除管网" class="deleteBox" @click="deleteLine(item.id)">
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
        <el-form :model="pipeForm" :rules="pipeFormRules" ref="pipeFormRef" class="demo-form-inline" label-width="90px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="管网名称:" prop="name">
                <el-input v-model="pipeForm.name" placeholder="请输入管网名称" size="mini" :readonly="this.lookPipeShow"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="管网长度:" prop="pipeLength" style="position: relative;">
                <el-input v-model="pipeForm.pipeLength" size="mini" readonly></el-input>
                <span style="position: absolute;left: 160px;">米</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="btnListBottom" v-show="!this.lookPipeShow">
        <el-button type="primary" :disabled="startClick" size="mini" @click="sumbit('pipeFormRef')">提交</el-button>
        <el-button size="mini" :disabled="startClick" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Amap from '@/assets/js/AmapAndUi'

export default {
  name: 'pipenetwork',
  data () {
    let pipeLong = (rule, value, callback) => {
      if (!value) {
        callback(new Error('水量不能为空'))
      } else {
        if (value <= 0) {
          callback(new Error('管网长度不能为0'))
        } else {
          callback()
        }
      }
    }
    return {
      colorIndex: null,
      lookPipeShow: false,
      alongList: [],
      startClick: false,
      qianyinLine: null,
      newLineData: [],
      pipeName: '',
      unPipeDom: null,
      title: '',
      pipeDomList: [],
      pipeList: [],
      newline: '',
      btnShow: false,
      listShow: true,
      mapobj: '',
      map: '',
      pipeForm: {
        id: null,
        name: '',
        pipeLength: 0,
        coordinatePoint: null
      },
      EditLine: null,
      pipeFormRules: {
        name: [{ required: true, message: '请输入管网名称', trigger: 'blur' }],
        pipeLength: [ { required: true, validator: pipeLong, trigger: 'change' } ]
      },
      describe: ''
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
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
            this.initPipe()
          })
        })
      }, () => this.$message.error('地图加载失败请刷新页面'))
    },
    dblclickPipe () {
      if (this.newline && this.newLineData.length > 1) {
        this.newLineData.splice((this.newLineData.length - 1), 1)
        this.newline.setPath(this.newLineData)
        this.pipeForm.pipeLength = this.mapobj.GeometryUtil.distanceOfLine(this.newLineData).toFixed(2)
        this.newLineData[0] = [this.newLineData[0].lng, this.newLineData[0].lat]
        try {
          if (this.newLineData[1].lng) this.newLineData[1] = [this.newLineData[1].lng, this.newLineData[1].lat]
        } catch (e) {
        }
        this.pipeForm.coordinatePoint = JSON.stringify(this.newLineData)
      }
      this.startClick = false
      this.addOver()
    },
    addOver () {
      this.map.off('click', this.clickPipe)
      this.map.off('mousemove', this.movePipe)
      this.map.off('rightclick', this.rightPipe)
      this.map.off('dblclick', this.dblclickPipe)
      if (this.qianyinLine) {
        this.map.remove(this.qianyinLine)
      }
      this.qianyinLine = null
      this.newLineData = []
    },
    clickPipe (e) {
      if (!this.startClick) this.startClick = true
      let x = e.lnglat.getLng()
      let y = e.lnglat.getLat()
      this.newLineData.push([x, y])
      if (this.newLineData.length === 2) {
        this.newline = new this.mapobj.Polyline({
          path: this.newLineData,
          isOutline: true,
          outlineColor: '#0a0ca9',
          borderWeight: 1,
          strokeColor: '#67c23a',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
          bubble: true
        })
        this.map.add(this.newline)
      } else if (this.newLineData.length > 2) {
        this.newline.setPath(this.newLineData)
      }
      if (this.newline) {
        this.pipeForm.pipeLength = this.mapobj.GeometryUtil.distanceOfLine(this.newLineData).toFixed(2)
      }
    },
    movePipe (e) {
      if (this.newLineData.length) {
        let x = e.lnglat.getLng()
        let y = e.lnglat.getLat()
        if (this.newLineData.length === 1 && !this.qianyinLine) {
          this.qianyinLine = new this.mapobj.Polyline({
            path: [this.newLineData[this.newLineData.length - 1], [x, y]],
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
          this.map.add(this.qianyinLine)
        } else if (this.qianyinLine) {
          this.qianyinLine.setPath([this.newLineData[this.newLineData.length - 1], [x, y]])
        }
        if (this.qianyinLine) {
          this.pipeForm.pipeLength = this.mapobj.GeometryUtil.distanceOfLine(this.newLineData).toFixed(2) || this.pipeForm.pipeLength
          let long = this.mapobj.GeometryUtil.distanceOfLine([this.newLineData[this.newLineData.length - 1], [x, y]]).toFixed(2)
          this.pipeForm.pipeLength = (Number(this.pipeForm.pipeLength) + Number(long)).toFixed(2)
        }
      }
    },
    rightPipe (e) {
      if (this.newLineData.length >= 2) {
        this.newLineData.splice((this.newLineData.length - 1), 1)
        this.newline.setPath(this.newLineData)
        this.movePipe(e)
        if (this.newline) {
          this.pipeForm.pipeLength = this.mapobj.GeometryUtil.distanceOfLine(this.newLineData).toFixed(2)
          let x = e.lnglat.getLng()
          let y = e.lnglat.getLat()
          let long = this.mapobj.GeometryUtil.distanceOfLine([this.newLineData[this.newLineData.length - 1], [x, y]]).toFixed(2)
          this.pipeForm.pipeLength = (Number(this.pipeForm.pipeLength) + Number(long)).toFixed(2)
        }
      }
    },
    lookPipe (index, name, pipeLength) {
      this.colorIndex = index
      this.pipeDomList.forEach(item => {
        if (item.getExtData().id === index) {
          item.setOptions({ strokeColor: '#f1e22d' })
          this.lookPipeShow = true
          this.btnShow = true
          this.title = '查看管网'
          this.describe = ''
          this.pipeForm.name = name
          this.pipeForm.pipeLength = pipeLength
          this.map.setFitView([item])
        } else item.setOptions({ strokeColor: '#88ffff' })
      })
    },
    async initPipe () {
      let res = await this.$api.product.getPipeData()
      if (res.code === 200) {
        if (this.pipeDomList.length >= 1) {
          this.map.remove(this.pipeDomList)
          this.pipeDomList = []
        }
        this.pipeList = JSON.parse(JSON.stringify(res.data))
        this.alongList = JSON.parse(JSON.stringify(res.data))
        this.pipeList.forEach((item, index) => {
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
            extData: { id: index },
            bubble: true
          })
          this.pipeDomList.push(pipe)
        })
        this.map.add(this.pipeDomList)
      } else this.$message.error('管网数据获取失败')
    },
    addpolyline () {
      this.$refs['pipeFormRef'].resetFields()
      this.title = '新增管网'
      this.describe = '鼠标左键点击地图添加，右键撤销上一位置，双击完成添加。'
      this.lookPipeShow = false
      this.listShow = false
      this.btnShow = true
      this.map.on('click', this.clickPipe)
      this.map.on('mousemove', this.movePipe)
      this.map.on('rightclick', this.rightPipe)
      this.map.on('dblclick', this.dblclickPipe)
    },
    updatapolyline (index, name, pipeLength, id) {
      this.$refs['pipeFormRef'].resetFields()
      this.title = '编辑管网'
      this.describe = '点击虚点增加位置，点击高亮点撤销位置，拖拽高亮点改变位置，双击完成修改。'
      this.pipeForm.name = name
      this.pipeForm.pipeLength = pipeLength
      this.pipeForm.id = id
      this.lookPipeShow = false
      this.listShow = false
      this.btnShow = true
      this.pipeDomList.forEach(item => {
        if (item.getExtData().id === index) {
          item.setOptions({ strokeColor: '#f1e22d' })
          this.unPipeDom = item
          this.pipeForm.id = id
          this.EditLine = new this.mapobj.PolyEditor(this.map, item)
          this.EditLine.open()
          this.map.setFitView([item])
          this.map.on('dblclick', this.upDblClick)
          this.EditLine.on('adjust', this.upPipeLong)
          this.EditLine.on('removenode', this.upPipeLong)
          this.startClick = true
        } else item.setOptions({ strokeColor: '#88ffff' })
      })
    },
    upDblClick () {
      this.EditLine.off('adjust', this.upPipeLong)
      this.EditLine.off('removenode', this.upPipeLong)
      this.map.off('dblclick', this.upDblClick)
      this.startClick = false
      this.EditLine.close()
      this.EditLine = null
    },
    upPipeLong () {
      this.pipeForm.pipeLength = this.unPipeDom.getLength().toFixed(2)
    },
    cancel () {
      if (this.title === '编辑管网') this.initPipe()
      if (this.title === '新增管网') this.newline && this.closeAddPipe()
      this.listShow = true
      this.btnShow = false
    },
    closeAddPipe () {
      this.map.remove(this.newline)
      this.newline = null
    },
    sumbit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.title === '新增管网') {
            let data = JSON.parse(JSON.stringify(this.pipeForm))
            delete data.id
            let res = await this.$api.product.addPipeData(data)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.cancel()
              this.initPipe()
            } else this.$message.error('添加失败')
          }
          if (this.title === '编辑管网') {
            let arr = []
            this.unPipeDom.getPath().forEach(item => {
              let arrSon = []
              arrSon.push(item.lng)
              arrSon.push(item.lat)
              arr.push(arrSon)
            })
            this.pipeForm.coordinatePoint = JSON.stringify(arr)
            let res = await this.$api.product.addPipeData(this.pipeForm)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.cancel()
              this.initPipe()
            } else this.$message.error('修改失败')
          }
        } else return this.$message.error('请完善管网信息')
      })
    },
    deleteLine (id) {
      this.$confirm('此操作将删除管网', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.product.delPipeData({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initPipe()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    }
  },
  watch: {
    pipeName (newVal) {
      this.pipeList = this.alongList
      this.pipeList = this.pipeList.filter(item => {
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
