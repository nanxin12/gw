<template>
  <div class="readingBox">
    <el-form :inline="true" :model="form" label-position="right">
      <el-form-item label="用户编号:" label-width="100px">
        <el-input v-model="form.userCode"></el-input>
      </el-form-item>
      <el-form-item label="水表类型:" label-width="100px">
        <el-select v-model="form.meterType" placeholder="请选择">
          <el-option label="NB水表" value="NBLOT"></el-option>
          <el-option label="红外线水表" value="INFRARE"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">重置内容</el-button>
        <el-button v-has="{type: 'download'}" type="primary" @click="download">模板下载</el-button>
        <el-button v-has="{type: 'import'}" type="primary" @click="upRead">批量导入</el-button>
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
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column prop="meterType" label="水表类型" align="center"></el-table-column>
          <el-table-column prop="total" label="水表累积量(吨)" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain v-has="{type: 'typing'}" type="success" size="mini" @click="addData(scope.row)" round>数据录入</el-button>
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
    <el-dialog title="录入数据" :visible.sync="addDid" width="30%" center @close="closeAddForm">
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="100px">
        <el-form-item label="水表编号:">
          <el-input v-model="addForm.meterCode" readonly></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="22">
            <el-form-item label="水表累计量:" prop="meterTotal">
              <el-input v-model="addForm.meterTotal" placeholder="请输入水表累积量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">吨</p>
          </el-col>
        </el-row>
        <el-form-item label="抄表人:">
          <el-input v-model="addForm.creator" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addRef')">确认</el-button>
        <el-button @click="addDid = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量导入" :visible.sync="upDig" width="30%" @close="closeUp">
      <el-form :model="upForm" :rules="upRules" ref="upRef" label-width="100px">
        <el-form-item label="水表类型:" prop="meterType">
          <el-select v-model="upForm.meterType" placeholder="请选择水表类型" style="width: 100%;">
            <el-option label="NB水表" value="NBLOT"></el-option>
            <el-option label="红外线水表" value="INFRARE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件:">
          <input ref="flie" class="upImg" type="file" name="files" @change="upload($event)">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upSubmit('upRef')">确 定</el-button>
        <el-button @click="upDig = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Reading',
  data () {
    let waters = (rule, value, callback) => {
      if (!value) {
        callback(new Error('累积量不能不空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('累积量格式不正确'))
        } else callback()
      }
    }
    return {
      upDig: false,
      addDid: false,
      addForm: {
        creator: JSON.parse(localStorage.getItem('userMsg')).name,
        meterCode: null,
        meterTotal: null,
        meterType: null
      },
      addRules: {
        meterTotal: [{ required: true, validator: waters, trigger: 'blur' }]
      },
      form: {
        meterType: 'NBLOT',
        userCode: null,
        eltotalCount: 0,
        size: 10,
        page: 1
      },
      upForm: {
        file: null,
        meterType: 'NBLOT'
      },
      upRules: {
        meterType: [{ required: true, message: '请选择水表类型', trigger: 'change' }]
      },
      tableData: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    upSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.upForm.file) return this.$message.error('请选择选择文件再上传')
          this.upForm.detailedAddress = `${this.upDistrictName}${this.upTownName}${this.upVillageName}`
          let form = new FormData()
          form.append('file', this.upForm.file)
          form.append('meterType', this.upForm.meterType)
          try {
            let res = await this.$api.sso.readMeterUp(form)
            if (res.code === 200) {
              this.upDig = false
              this.$message.success('导入成功')
              this.initData()
            } else this.$message.error('导入失败')
          } catch (e) {
            this.upForm.file = null
          }
        } else this.$message.error('请完善用户信息')
      })
    },
    closeUp () {
      this.$refs.upRef.resetFields()
      this.$refs.flie.value = null
      this.upForm.file = null
    },
    upload (e) {
      if ((e.target.files[0].size / (1024 * 1024)) > 2) return this.$message.error('上传文件大小不能超过2M')
      let type = e.target.files[0].name.split('.')
      if (type[1] !== 'xlsx') return this.$message.error('上传文件必须是xlsx格式')
      this.upForm.file = e.target.files[0]
    },
    upRead () {
      this.upDig = true
    },
    closeAddForm () {
      this.$refs.addRef.resetFields()
    },
    addData ({ meterCode, meterType }) {
      this.addForm.meterCode = meterCode
      this.addForm.meterType = meterType
      this.addDid = true
    },
    // 下载模板
    async download () {
      let res = await this.$api.sso.readMeterDownload()
      let url = window.URL.createObjectURL(new Blob([res]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '抄表信息.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 手动录入提交
    addSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$api.sso.addReadMeter(this.addForm)
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.initData()
            this.addDid = false
          } else this.$message.error('添加失败')
        } else this.$message.error('请填写录入信息')
      })
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.userCode = null
      this.initData()
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.readMeter(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
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
    // 改变表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload-demo {
    text-indent: 0;
    margin: 0 10px;
    width: 98px;
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
  .rbBottom{
    margin-bottom: 20px;
  }
</style>
