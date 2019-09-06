<template>
  <!-- 角色列表 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="角色名称"
          label-width="70px">
          <el-input v-model="form.roleName"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery('query')">搜索</el-button>
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
          :header-cell-style="tableHeaderColor">
          <!-- <el-table-column type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roleName"
            label="角色名称"
            align="center"></el-table-column>
          <el-table-column prop="status"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'ENABLED'">启用</div>
              <div v-if="scope.row.status === 'DISABLED'">禁用</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"
            :formatter='formatter'
            label="创建时间"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                v-has="{type: 'update'}"
                @click="handleRevise(scope.row, '2')"
                round>修改</el-button>
              <el-button size="mini"
                v-has="{type: 'delete'}"
                @click="handleDelete(scope.row)"
                round>删除</el-button>
              <el-button size="mini"
                v-has="{type: 'authorize'}"
                @click="handleMenu(scope.row, '4')"
                round>授权</el-button>
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
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="角色名称"
                :label-width='lableWidth'
                prop="roleName">
                <el-input v-model="ruleForm.roleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="是否启用"
                :label-width='lableWidth'
                prop="status">
                <el-switch v-model="ruleForm.status"
                  active-value="ENABLED"
                  active-color="#13ce66"
                  inactive-value="DISABLED"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="备注"
                :label-width='lableWidth'
                prop="proRemarks">
                <el-input v-model="ruleForm.proRemarks"
                  type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>
      <div v-if="this.state === '4'"
        style="height:500px">
        <el-scrollbar>
          <el-tree :data="dataTree" style="min-height:500px"
            show-checkbox
            :check-strictly='true'
            :default-checked-keys='checkedData'
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
        </el-scrollbar>
      </div>
      <!-- ------------ -->
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="12">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary"
              v-if="this.state === '4'"
              @click="handleTreeSure">确 定</el-button>
            <el-button type="primary"
              v-else
              @click="handleSumbit('ruleForm')">确 定</el-button>
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
      dialogWidth: '45%',
      roleForm: {
        roleName: '',
        status: 'ENABLED'
      },
      dataTree: [],
      checkedData: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        roleName: '',
        status: ''
      },
      form: {
        roleName: ''
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增用户',
      lableWidth: '95px',
      // 供应商分类数据
      supplierData: [],
      productNameData: [],
      id: ''
    }
  },
  methods: {
    handleTreeSure () {
      let strArr = this.$refs.tree.getCheckedKeys().join(',')
      this.$api.roleList.authorizePermission({ roleId: this.id, menuId: strArr }).then(res => {
        if (res.code === 200) {
          this.dialog = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000 })
      } else {
        return '暂无数据'
      }
    },
    // 分配角色
    handleMenu (val, state) {
      this.dialogWidth = '35%'
      this.state = state
      this.dialogTitle = '设置菜单'
      this.dialog = true
      this.id = val.id
      // 获取菜单树
      this.$api.roleList.getMenuTree({ roleId: val.id, userId: 1 }).then(res => {
        if (res.code === 200) {
          this.dataTree = res.data
          let ccc = []
          let fn = (arr) => {
            arr.forEach(v => {
              if (v.checked === true) {
                ccc.push(v.id)
              }
              if (v.children !== [] && v.children !== undefined) {
                return fn(v.children)
              }
            })
          }
          fn(this.dataTree)
          this.checkedData = ccc
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleQuery () {
      this.initdata()
    },
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        this.$api.roleList.deleteRoleByIds({ ids: val.id }).then(res => {
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
    initdata (val) {
      // 初始化数据
      val ? this.page = 1 : this.page = this.page
      this.$api.roleList.getRoleList({ pageNum: this.page, pageSize: this.limit, roleName: this.form.roleName }).then(res => {
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
      this.dialogWidth = '45%'
      this.dialogTitle = '新增用户'
      this.dialog = true
      this.state = val
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogWidth = '45%'
      this.dialogTitle = '修改用户'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.roleList.getRoleById({ roleId: val.id }).then(res => {
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
          let { roleName, status, createTime, creator, id } = this.ruleForm
          // 新增
          if (this.state === '1') {
            createTime = Math.round(new Date().getTime() / 1000)
            creator = 1
            let obj = { roleName, status, createTime, creator }
            this.$api.roleList.insertRole(obj).then(res => {
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
            let obj = { roleName, status, createTime, creator, id }
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
