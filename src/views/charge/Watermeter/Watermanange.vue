<template>
  <div class="manageBox">
    <el-form :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item label="水表编号:">
        <el-input v-model="form.meterCode" placeholder="请输入水表编号"></el-input>
      </el-form-item>
      <el-form-item label="水表状态:">
        <el-select v-model="form.status" placeholder="请选择水表状态">
          <el-option label="已绑定" value="ISBIND"></el-option>
          <el-option label="未绑定" value="NOTBIND"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset" style="margin-left: 10px">重置内容</el-button>
        <el-button v-has="{type: 'add'}" type="primary" @click="addMeter">添加水表</el-button>
        <el-button v-has="{type: 'download'}" type="primary" @click="download">模板下载</el-button>
        <el-button v-has="{type: 'import'}" type="primary" @click="upFiles">批量导入</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column prop="meterType" label="水表类型" align="center"></el-table-column>
          <el-table-column prop="meterValiber" label="水表口径(mm)" align="center"></el-table-column>
          <el-table-column prop="meterStress" label="水表压力(MPa)" align="center"></el-table-column>
          <el-table-column label="水表状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status ==='NOTBIND'">
                <el-tag type="danger">未绑定</el-tag>
              </span>
              <span v-if="scope.row.status ==='ISBIND'">
                <el-tag type="success">已绑定</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="meterVender" label="水表厂家" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain v-has="{type: 'update'}" type="success" style="margin: 5px" round size="mini" @click="putMeter(scope.row)">编辑</el-button>
              <el-button plain v-has="{type: 'delete'}" type="danger" style="margin: 5px" round size="mini" @click="deletes(scope.row.id)">删除</el-button>
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
    <input v-show="false" ref="flie" type="file" name="files" @change="upload($event)">
    <el-dialog :title="titleDid" :visible.sync="meterDig" width="30%" @close="closeMeter" @opened="openDigMeter" center>
      <el-form :model="meterForm" :rules="meterRules" ref="meterRef" label-width="90px">
        <el-form-item label="水表编号:" prop="meterCode">
          <el-input v-model="meterForm.meterCode" placeholder="请输入水表编号" :readonly="readShow"></el-input>
        </el-form-item>
        <el-form-item label="水表分类:" prop="meterType">
          <el-radio-group v-model="meterForm.meterType">
            <el-radio label="NBLOT">NB水表</el-radio>
            <el-radio label="INFRARE">红外线水表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="水表厂家:" prop="meterVender">
          <el-input v-model="meterForm.meterVender" placeholder="请输入水表厂家"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="21">
            <el-form-item label="水表压力:" prop="meterStress">
              <el-input v-model="meterForm.meterStress" placeholder="请输入水表压力"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">MPa</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="水表口径:" prop="meterValiber">
              <el-input v-model="meterForm.meterValiber" placeholder="请输入水表口径"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">mm</p>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="meterSubmit('meterRef')">确定</el-button>
        <el-button @click="meterDig = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Watermanange',
  data () {
    return {
      meterData: {},
      readShow: false,
      titleDid: null,
      meterDig: false,
      form: {
        eltotalCount: 0,
        size: 10,
        page: 1,
        status: null,
        meterCode: null
      },
      tableData: [],
      meterForm: {
        id: null,
        meterCode: null,
        meterType: 'NBLOT',
        status: null,
        meterVender: null,
        meterStress: null,
        meterValiber: null
      },
      meterRules: {
        meterCode: [{ required: true, message: '请输入水表编号', trigger: 'blur' }],
        meterType: [{ required: true, message: '请选中水表类型', trigger: 'change' }],
        meterVender: [{ required: true, message: '请输入水表厂家', trigger: 'blur' }],
        meterStress: [{ required: true, message: '请输入水表压力', trigger: 'blur' }],
        meterValiber: [{ required: true, message: '请输入水表口径', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    upFiles () {
      this.$refs.flie.click()
    },
    async upload (e) {
      if ((e.target.files[0].size / (1024 * 1024)) > 2) return this.$message.error('上传文件大小不能超过2M')
      let type = e.target.files[0].name.split('.')
      if (type[1] !== 'xlsx') return this.$message.error('上传文件必须是xlsx格式')
      let form = new FormData()
      form.append('file', e.target.files[0])
      try {
        let res = await this.$api.sso.meterUp(form)
        if (res.code === 200) {
          this.$refs.flie.value = null
          this.$message.success('导入成功')
          this.initData()
        } else this.$message.error('导入失败')
      } catch (e) {
        this.$refs.flie.value = null
      }
    },
    // 打开DIG结束回调
    openDigMeter () {
      if (this.titleDid === '编辑水表') {
        this.meterForm.id = this.meterData.id
        this.meterForm.meterCode = this.meterData.meterCode
        this.meterForm.meterType = this.meterData.meterType
        this.meterForm.meterVender = this.meterData.meterVender
        this.meterForm.meterStress = this.meterData.meterStress
        this.meterForm.meterValiber = this.meterData.meterValiber
      }
    },
    // 添加水表打开
    addMeter () {
      this.titleDid = '新增水表'
      this.readShow = false
      this.meterDig = true
    },
    // 水表弹窗关闭
    closeMeter () {
      this.$refs.meterRef.resetFields()
    },
    // 水表提交
    meterSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.titleDid === '新增水表') {
            this.meterForm.status = 'NOTBIND'
            let data = JSON.parse(JSON.stringify(this.meterForm))
            delete data.id
            let res = await this.$api.sso.addWaterMeter(data)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.meterDig = false
              this.initData()
            } else this.$message.error('添加失败')
          } else {
            let data = JSON.parse(JSON.stringify(this.meterForm))
            delete data.status
            let res = await this.$api.sso.putMeter(data)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.meterDig = false
              this.initData()
            } else this.$message.error('修改失败')
          }
        } else {
          this.$message.error('请完善水表信息')
          return false
        }
      })
    },
    // 模板下载
    async download () {
      let res = await this.$api.sso.meterDownload()
      let url = window.URL.createObjectURL(new Blob([res]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '水表信息.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 修改打开
    putMeter (obj) {
      this.meterData = obj
      this.titleDid = '编辑水表'
      this.readShow = true
      this.meterDig = true
    },
    // 删除水表
    deletes (id) {
      this.$confirm('确认删除水表', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.sso.delMeter({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    },
    // 初始化数据
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getMeterList(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('水表数据获取失败')
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
    // 重置
    reset () {
      this.form.page = 1
      this.form.status = null
      this.form.meterCode = null
      this.initData()
    },
    // 改变表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-demo {
    display: inline-block;
    margin-left: 10px;
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
</style>
