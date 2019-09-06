<template>
  <!-- 仓库管理 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item>
          <el-button type="danger"
            v-has="{type: 'delete'}"
            @click="handleDeletes">批量删除</el-button>
          <el-button type="success"
            v-has="{type: 'add'}"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd('1')">添加</el-button>
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
          @selection-change="handleSelectionChange"
          :header-cell-style="tableHeaderColor">
          <el-table-column type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="whouseNumber"
            label="仓库编号"
            align="center"></el-table-column>
          <el-table-column prop="whouseName"
            label="仓库名称"
            align="center"></el-table-column>
          <el-table-column prop="whouseDes"
            label="描述"
            align="center"></el-table-column>
          <el-table-column label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain round size="mini"
                v-has="{type: 'update'}"
                @click="handleRevise(scope.row, '2')">修改</el-button>
              <el-button type="danger" plain round size="mini"
                v-has="{type: 'delete'}"
                @click="handleDelete(scope.row)">删除</el-button>
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
      width="40%"
      center>
      <el-form :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left">
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="仓库编号">
              <el-input v-model="ruleForm.whouseNumber"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="仓库名称"
              prop="whouseName">
              <el-input v-model="ruleForm.whouseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24'>
            <el-form-item label="描述"
              prop="whouseDes">
              <el-input v-model="ruleForm.whouseDes"
                type="textarea"
                :rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="handleSumbit('ruleForm')">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Wmanage',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        whouseNumber: '',
        whouseName: '',
        whouseDes: ''
      },
      form: {},
      rules: {
        whouseName: [{ required: true, message: '请输入仓库名称', trigger: 'change' }],
        whouseDes: [{ required: true, message: '请输入描述', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增仓库',
      // 保存批量选择数据
      selectionChangeData: []
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.selectionChangeData = val
    },
    // 删除
    handleDelete (val) {
      this.deleteApi(val)
    },
    // 删除接口内置判断
    deleteApi (val) {
      this.$confirm('确认删除？').then(_ => {
        // 删除的接口
        let api = (val) => {
          this.$api.wmanageht.deletes({ id: val }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.initdata()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        // 单个删除
        let objDelete = () => {
          api(val.id)
        }
        // 批量循环删除
        let arrDelete = () => {
          val.forEach(v => {
            api(v.id)
          })
        }
        // 单个删除数据为obj没有length，批量删除数据为arr有length
        val.length === undefined ? objDelete() : arrDelete()
      })
    },
    // 批量删除
    handleDeletes () {
      if (0 in this.selectionChangeData) {
        this.deleteApi(this.selectionChangeData)
      } else {
        this.$message.error('请选中数据')
      }
    },
    initdata () {
      // 初始化数据
      this.$api.wmanageht.getList({ pageNum: this.page, pageSize: this.limit }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogTitle = '新增仓库'
      this.dialog = true
      this.state = val
      // 获取仓库编号
      this.$api.wmanageht.getNum().then(res => {
        if (res.code === 200) {
          this.ruleForm.whouseNumber = res.data.whousenum
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '修改仓库'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.wmanageht.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
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
          let { whouseNumber, whouseName, whouseDes, id } = this.ruleForm
          // 新增
          if (this.state === '1') {
            let obj = { whouseNumber, whouseName, whouseDes }
            this.$api.wmanageht.save(obj).then(res => {
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
            let obj = { whouseNumber, whouseName, whouseDes, id }
            this.$api.wmanageht.update(obj).then(res => {
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
    // 表单重置
    resetForm () {
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
    }
  },
  mounted () {
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
</style>
