<template>
  <!-- 用户列表 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <!-- <el-form-item label="用户名称"
          label-width="70px">
          <el-input v-model="form.productName"
            clearable></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="岗位"
          label-width="50px">
          <el-select v-model="ruleForm.productclassifi"
            placeholder="请选择">
            <el-option v-for="item in aa"
              :class="item.value"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery">刷新</el-button>
          <!-- <el-button type="danger"
            icon="el-icon-delete"
            @click="handleDeletes">批量删除</el-button> -->
          <!-- <el-button type="warning"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd('1')">重置密码</el-button> -->
          <el-button type="success"
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
          <!-- @selection-change="handleSelectionChange" -->
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
          <!-- <el-table-column prop="realName"
            label="用户名"
            align="center"></el-table-column> -->
          <el-table-column prop="realName"
            label="真实姓名"
            align="center"></el-table-column>
          <!-- <el-table-column prop="productclassifi"
            label="岗位"
            align="center"></el-table-column> -->
          <!-- <el-table-column prop="productspec"
            label="地区"
            align="center"></el-table-column> -->
          <el-table-column prop="phone"
            label="手机号码"
            align="center"></el-table-column>
          <el-table-column prop="status"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'ANONYMOUS'">匿名</div>
              <div v-if="scope.row.status === 'RRGISTERED'">已注册</div>
              <div v-if="scope.row.status === 'LOCK'">锁定</div>
              <div v-if="scope.row.status === 'ACTIVE'">激活</div>
              <div v-if="scope.row.status === 'CANCEL'">注销</div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                @click="handleRevise(scope.row, '2')"
                round>修改</el-button>
              <el-button size="mini"
                @click="handleDelete(scope.row)"
                round>删除</el-button>
              <!-- <el-button size="mini"
                @click="handleRevisePwd(scope.row, '3')"
                round>修改密码</el-button> -->
              <el-button size="mini"
                @click="handleRole(scope.row, '4')"
                round>分配角色</el-button>
              <el-button size="mini"
                @click="handlePost(scope.row, '5')"
                round>分配岗位</el-button>
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
            <!-- <el-col :span='11'>
              <el-form-item label="用户名"
                :label-width='lableWidth'
                prop="realName">
                <el-input v-model="ruleForm.realName"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span='11'>
              <el-form-item label="真实姓名"
                :label-width='lableWidth'
                prop="realName">
                <el-input v-model="ruleForm.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="手机号码"
                :label-width='lableWidth'
                prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="身份证号码"
                :label-width='lableWidth'
                prop="idCard">
                <el-input v-model="ruleForm.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="状态"
                :label-width='lableWidth'
                prop="status">
                <el-switch v-model="ruleForm.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="ACTIVE"
                  inactive-value="LOCK">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="this.state === '3'">
        <el-form :model="passwordForm"
          :rules="passwordRules"
          ref="passwordForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="原密码"
                :label-width='lableWidth'
                prop="lastPass">
                <el-input v-model="passwordForm.lastPass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="新密码"
                :label-width='lableWidth'
                prop="newPass">
                <el-input v-model="passwordForm.newPass"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="this.state === '4'">
        <el-form :model="roleForm"
          :rules="rules"
          ref="roleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="选择角色"
                :label-width='lableWidth'
                prop="ids">
                <el-checkbox-group v-model="roleForm.ids"
                  :min="1">
                  <el-checkbox v-for="item in roleData"
                    :label="item.id"
                    :key="item.id">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="this.state === '5'"
        style="height:500px">
        <el-scrollbar>
          <el-tree :data="menuData"
            style="min-height:500px"
            :check-strictly='true'
            show-checkbox
            :default-expanded-keys='this.menuDataExpanded'
            ref="fatherTree"
            node-key="id"
            :props="defaultProps"
            :highlight-current='true'></el-tree>
        </el-scrollbar>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="12">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary"
              v-if="this.state === '3'"
              @click="handlePwdTrue('passwordForm')">确 定</el-button>
            <el-button type="primary"
              v-else-if="this.state === '4'"
              @click="handleRoleTrue">确 定</el-button>
            <el-button type="primary"
              v-else-if="this.state === '5'"
              @click="handleOrganizeTrue">确 定</el-button>
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
export default {
  name: 'userList',
  data () {
    return {
      menuDataExpanded: [],
      menuDataChecked: [],
      // 岗位树数据
      menuData: [],
      roleData: [],
      aa: ['上海', '北京', '广州', '深圳'],
      dialogWidth: '45%',
      roleForm: {
        ids: []
      },
      passwordForm: {
        lastPass: '',
        newPass: ''
      },
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'postName'
      },
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        realName: '',
        userId: '',
        phone: '',
        idCard: '',
        status: 'ACTIVE'
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        phone: [{ required: true, message: '请输入联系电话', trigger: 'change' }, { type: 'string', pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '手机号格式有误！', trigger: 'change' }],
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'change' }],
        idCard: [{ required: true, message: '请输入证件号码', trigger: 'change' }, { type: 'string', pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '证件号码格式有误！', trigger: 'change' }]
      },
      passwordRules: {
        lastPass: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
        newPass: [{ required: true, message: '请输入新密码', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增用户',
      // 保存批量选择数据
      selectionChangeData: [],
      lableWidth: '95px',
      // 供应商分类数据
      supplierData: [],
      productNameData: [],
      id: '',
      userId: ''
    }
  },
  methods: {
    // 分配岗位
    handlePost (val, state) {
      this.dialogWidth = '30%'
      this.state = state
      this.dialogTitle = '分配岗位'
      this.dialog = true
      this.id = val.id
      this.userId = val.userId
      this.$api.userList.getPostTreeByUserIdAndRegionId({ userId: this.userId }).then(res => {
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
          this.$refs.fatherTree.setCheckedKeys(ccc)
          this.menuDataExpanded = ccc
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 分配角色
    handleRole (val, state) {
      this.dialogWidth = '35%'
      this.state = state
      this.dialogTitle = '分配角色'
      this.dialog = true
      this.id = val.id
      this.userId = val.userId
      // 获取角色
      this.$api.userList.getRoleListByUserId({ userId: this.userId }).then(res => {
        if (res.code === 200) {
          this.roleData = res.data
          this.roleData.forEach(v => {
            if (v.checked) {
              this.roleForm.ids.push(v.id)
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改密码
    handleRevisePwd (val, state) {
      this.state = state
      this.dialogWidth = '25%'
      this.dialogTitle = '修改密码'
      this.dialog = true
    },
    handleQuery () {
      this.initdata()
    },
    handleSelectionChange (val) {
      this.selectionChangeData = val
    },
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        this.$api.userList.deletes({ id: val.userId }).then(res => {
          this.initdata()
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
      // 初始化数据
      this.$api.userList.list({ pageNum: this.page, pageSize: this.limit }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取省
      // this.$api.organizeList.getProvince().then(res => {
      //   if (res.code === 200) {
      //     this.province = res.data[0].children
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
      // 获取岗位
      this.$api.organizeList.getPostTreeList({ level: '', regionId: '' }).then(res => {
        if (res.code === 200) {
          this.menuData = res.data
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
      this.$api.userList.findById({ id: val.userId }).then(res => {
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
          let { id, realName, userId, phone, idCard, status } = this.ruleForm
          // 新增
          if (this.state === '1') {
            let obj = { realName, userId, phone, idCard, status }
            this.$api.userList.save(obj).then(res => {
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
            let obj = { id, realName, userId, phone, idCard, status }
            this.$api.userList.upDate(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          // 修改密码
          if (this.state === '3') {
            alert('1')
          }
        } else {
          this.$message.error('请完善信息')
          return false
        }
      })
    },
    handlePwdTrue (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.passwordForm)
          // let { id, lastPass, newPass } = this.passwordForm
          // this.$api.userList.save(obj).then(res => {
          //   if (res.code === 200) {
          //     this.$message.success(res.msg)
          //     this.dialog = false
          //     this.initdata()
          //   } else {
          //     this.$message.error(res.msg)
          //   }
          // })
        } else {
          this.$message.error('请完善信息')
          return false
        }
      })
    },
    handleRoleTrue () {
      let ids = this.roleForm.ids.join(',')
      this.$api.userList.assignRoles({ roleIds: ids, userId: this.userId }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialog = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOrganizeTrue () {
      let arr = this.$refs.fatherTree.getCheckedNodes()
      let arrs = []
      arr.forEach(v => {
        arrs.push(v.id)
      })
      let postIds = arrs.join(',')
      this.$api.userList.assignPosts({ postIds: postIds, userId: this.userId }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialog = false
        } else {
          this.$message.error(res.msg)
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
      if (this.$refs['roleForm'] !== undefined) {
        this.roleForm.ids = []
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
