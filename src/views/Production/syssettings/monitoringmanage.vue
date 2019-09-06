<template>
  <!-- 角色列表 -->
  <div class="inner">
    <!-- 头部 -->
    <!-- <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="80px"
        label-position="left">
        <el-form-item label="站点名称:">
          <el-select v-model="form.stationId"
            placeholder="请选择">
            <el-option v-for="item in stationLists"
              :key="item.name"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery('query')">搜索</el-button>
          <el-button type="success"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd('1')">添加</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <!-- 中间内容 -->
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          border
          :header-cell-style="tableHeaderColor">
          <!-- <el-table-column type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cameraName"
            label="监控名称"
            align="center"></el-table-column>
          <el-table-column prop="stationName"
            label="站点名称"
            align="center">
          </el-table-column>
          <!-- <el-table-column prop="createTime"
            :formatter='formatter'
            label="创建时间"
            align="center"></el-table-column> -->
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <el-button type="success"
                style="margin: 5px"
                plain
                round
                size="mini"
                @click="handleAdd(scope.row, '1')">编辑</el-button>
              <!-- <el-button type="danger"
                style="margin: 5px"
                plain
                round
                size="mini"
                @click="handleDelete(scope.row)">删除</el-button> -->
              <div>{{scope.a}}</div>
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
    <!-- 弹窗修改删除 -->
    <el-dialog :title="dialogTitle"
      :visible.sync="dialog"
      :width="dialogWidth"
      center>
      <div v-if="this.state === '1' || this.state === '2'">
        <el-form :model="ruleForm"
          :rules="rules"
          ref="ruleForms"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="站点名称:"
                prop="stationCode">
                <el-select v-model="ruleForm.stationCode"
                  filterable
                  placeholder="请选择">
                  <el-option v-for="item in stationLists"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- ------------ -->
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="12">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary"
              @click="handleSumbit('ruleForms')">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'userList',
  data () {
    return {
      total: 0,
      limit: 10,
      page: 1,
      stationLists: [],
      dialogWidth: '45%',
      tableData: [],
      ruleForm: {
        stationCode: null,
        cameraName: null,
        camerCode: null
      },
      form: {
        stationId: ''
      },
      rules: {
        cameraName: [{ required: true, message: '', trigger: 'change' }],
        camerCode: [{ required: true, message: '', trigger: 'change' }],
        stationCode: [{ required: true, message: '请选择站点', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增监控',
      lableWidth: '95px',
      id: ''
    }
  },
  methods: {
    async initAllStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationLists = res.data
      } else this.$message.error('站点数据获取失败')
    },
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000 })
      } else {
        return '暂无数据'
      }
    },
    handleQuery () {
      this.initdata()
    },
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        this.$api.product.deleteCameraById({ ids: val.id }).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.initdata()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
        this.$message.error('已取消')
      })
    },
    initdata () {
      this.$api.product.getMonitoringResources({ pageSize: this.limit, pageNo: this.page }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.data.list
          this.tableData.forEach(item => {
            this.$api.product.getCameraByCameraCode({ cameraCode: item.cameraIndexCode }).then(res => {
              if (res.code === 200) {
                this.stationLists.forEach(v => {
                  if (v.id === res.data) {
                    this.$set(item, 'stationName', v.name)
                  }
                })
              }
            })
          })
          this.total = res.data.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (row, val) {
      this.dialogWidth = '45%'
      this.dialogTitle = '新增监控'
      this.dialog = true
      this.state = val
      this.ruleForm.cameraName = row.cameraName
      this.ruleForm.camerCode = row.cameraIndexCode
      this.$api.product.getCameraByCameraCode({ cameraCode: row.cameraIndexCode }).then(res => {
        if (res.code === 200) {
          this.ruleForm.stationCode = res.data
        }
      })
      // this.ruleForm.stationCode
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
    // 表头样式改变
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    // 添加管理员提交
    handleSumbit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { camerCode, cameraName, stationCode, id } = this.ruleForm
          // 新增
          if (this.state === '1') {
            let obj = { camerCode, cameraName, stationCode }
            this.$api.product.bindingStation(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          // 修改
          if (this.state === '2') {
            let obj = { camerCode, cameraName, stationCode, id }
            this.$api.roleList.updateRole(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {
          this.$message.error('请完善信息')
          return false
        }
      })
    },
    // 表单重置
    resetForm () {
      if (this.$refs['ruleForms'] !== undefined) {
        console.log(this.ruleForm)
        this.$refs['ruleForms'].resetFields()
      }
    }
  },
  mounted () {
    this.initAllStation()
    this.initdata()
  },
  watch: {
    dialog (a, b) {
      if (!a) {
        this.resetForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 62px;
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
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar {
  height: 100%;
}
</style>
