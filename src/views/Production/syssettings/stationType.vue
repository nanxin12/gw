<template>
  <div>
    <div class="pbTop" v-has="{type: 'add'}">
      <i class="el-icon-circle-plus-outline"></i><p @click="addType">添加站点类型</p>
    </div>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" class="tables" stripe border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="站点类型名称" align="center"></el-table-column>
          <el-table-column label="站点图标" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.images" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="typeSpecification" label="类型描述" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-has="{type: 'update'}" type="success" style="margin: 5px" plain round size="mini" @click="updata(scope.row)">编辑</el-button>
              <el-button v-has="{type: 'delete'}" type="danger" style="margin: 5px" plain round size="mini" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="titleDid" :visible.sync="Dig" @opened="openDig" @close="closeDig" width="30%">
      <el-form :model="typeForm" :rules="typeRules" ref="typeRef" label-width="90px">
        <el-form-item label="类型名称:" prop="typeEnum">
          <el-select v-model="typeForm.typeEnum" placeholder="请选择" style="width: 100%;" @change="nameChange">
            <el-option v-for="item in typeNmaeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型描述:" prop="typeSpecification">
          <el-input type="textarea" :rows="4" v-model="typeForm.typeSpecification" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="现场照片:">
          <div class="upBox">
            <input title="点击上传或拖拽上传" ref="file" class="upImg" type="file" name="files" @change="upload($event)">
            <div class="upDiv">
              <i class="el-icon-plus"></i>
            </div>
            <div class="imgBox" v-if="typeForm.images">
              <div class="imgShade">
                <i class="el-icon-delete" @click="imgDel"></i>
              </div>
              <img :src="typeForm.images" alt="">
            </div>
          </div>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="typeSubmit('typeRef')">确定</el-button>
          <el-button @click="Dig = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'stationType',
  data () {
    return {
      typeNmaeList: [
        { name: '水厂', value: 'WATER_WORKS' },
        { name: '泵站', value: 'PUMP_STATION' },
        { name: '监测点', value: 'MONITORING' },
        { name: '蓄水池', value: 'IMPOUNDING' },
        { name: '高位水池', value: 'HIGH_WATER' }
      ],
      tableData: [],
      Dig: false,
      titleDid: '',
      typeForm: {
        id: null,
        typeName: null,
        typeEnum: null,
        typeSpecification: null,
        images: null
      },
      temporary: {},
      typeRules: {
        typeEnum: [{ required: true, message: '请选择类型名称', trigger: 'change' }],
        typeSpecification: [{}]
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    nameChange (val) {
      this.typeForm.typeName = this.typeNmaeList.find(item => item.value === val).name
    },
    imgDel () {
      this.typeForm.images = null
    },
    openDig () {
      if (this.titleDid === '修改站点类型') {
        let { id, typeEnum, typeSpecification, images, typeName } = this.temporary
        this.typeForm.id = id
        this.typeForm.typeEnum = typeEnum
        this.typeForm.typeName = typeName
        this.typeForm.typeSpecification = typeSpecification
        this.typeForm.images = images
      }
    },
    async upload (e) {
      let form = new FormData()
      if ((e.target.files[0].size / (1024 * 1024)) > 20) return this.$message.error('上传图片大小不能超过20M')
      if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg') {
      } else return this.$message.error('上传图片必须是jpg或png格式')
      form.append('fileName', e.target.files[0])
      try {
        let res = await this.$api.product.addStationTypeImg(form)
        if (res.code === 200) {
          this.$message.success('图片上传成功')
          this.typeForm.images = res.data
          this.$refs.file.value = null
        }
      } catch (e) {
        this.$refs.file.value = null
      }
    },
    typeSubmit (formName) {
      if (!this.typeForm.images) return this.$message.error('请上传站点类型图片')
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.titleDid === '添加站点类型') {
            let data = JSON.parse(JSON.stringify(this.typeForm))
            delete data.id
            let res = await this.$api.product.addStationType(data)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.Dig = false
              this.initData()
            } else this.$message.error('添加失败')
          } else {
            let res = await this.$api.product.putStationType(this.typeForm)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.Dig = false
              this.initData()
            } else this.$message.error('修改失败')
          }
        } else {
          this.$message.error('请完善类型信息')
          return false
        }
      })
    },
    closeDig () {
      this.$refs.typeRef.resetFields()
      this.typeForm.images = null
    },
    async initData () {
      let res = await this.$api.product.getStationType()
      if (res.code === 200) {
        this.tableData = res.data
      } else this.$message.error('数据获取失败')
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (Object.is(rowIndex, 0)) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    addType () {
      this.Dig = true
      this.titleDid = '添加站点类型'
    },
    updata ({ id, typeEnum, typeSpecification, images, typeName }) {
      this.Dig = true
      this.titleDid = '修改站点类型'
      this.temporary = { id, typeEnum, typeSpecification, images, typeName }
    },
    del (id) {
      this.$confirm('此操作将删除站点类型', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.product.delStationType({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pbTop{
    margin: 4px 0 10px 0;
    display: flex;
    align-items: center;
    i{
      font-size: 16px!important;
      color: #4292FF;
      margin-right: 5px;
    }
    p{
      font-size: 14px;
      color: #4292FF;
      cursor: pointer;
    }
    p:hover{
      text-decoration: underline;
    }
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
      .tables{
        margin-bottom: 20px;
      }
    }
  }
  .upBox{
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .upImg{
      cursor: pointer;
      width: 30px;
      height: 30px;
      opacity: 0;
      z-index: 1;
      margin-right: 10px;
    }
    .upDiv{
      width: 30px;
      height: 30px;
      position: absolute;
      left: 0;
      top: 0;
      box-sizing: border-box;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      i{
        font-size: 12px;
        color: #8c939d;
      }
    }
    .imgBox{
      width: 30px;
      height: 30px;
      margin: 0 10px 10px 0;
      position: relative;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      .imgShade{
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 6px;
        left: 0;
        top: 0;
        background: rgba(0,0,0,.5);
        transition: opacity .3s;
        i{
          font-size: 12px;
          color: #fff;
          margin: 0 10px;
        }
      }
      img{
        border-radius: 6px;
        width: 100%;
        height: 100%;
      }
    }
    .imgBox:hover .imgShade{
      opacity: 1;
    }
  }
</style>
