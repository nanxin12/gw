<template>
  <!-- 角色列表 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <!-- <el-form-item label="角色名称"
          label-width="70px">
          <el-input v-model="form.roleName"
            clearable></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-refresh"
            @click="handleQuery">刷新</el-button>
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
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="url"
            label="url"
            align="center"></el-table-column>
          <el-table-column prop="roleName"
            label="角色名称"
            align="center">
          </el-table-column>
          <el-table-column prop="postName"
            label="岗位名称"
            align="center">
          </el-table-column>
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <!-- <el-button size="mini"
                @click="handleRevise(scope.row, '2')"
                round>修改</el-button> -->
              <el-button size="mini"
                @click="handleDelete(scope.row)"
                round>删除</el-button>
              <el-button size="mini"
                @click="handleRevisePwd(scope.row, '3')"
                round>后台链接</el-button>
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
              <el-form-item label="url"
                :label-width='lableWidth'
                prop="url">
                <el-input v-model="ruleForm.url"
                  placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="角色名称"
                :label-width='lableWidth'
                prop="roleId">
                <el-select v-model="ruleForm.roleId"
                  multiple
                  placeholder="请选择">
                  <el-option v-for="item in roleSelect"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="岗位名称"
                :label-width='lableWidth'
                prop="postIds">
                <el-input v-model="ruleForm.postIds"
                  disabled
                  @click.native='fatherTree'></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="this.state === '3'">
        <el-form :model="urlForm"
          :rules="rules"
          ref="urlForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-form-item label="入参"
            :label-width='lableWidth'>
            <div v-for="(v, childrenIndex) in urlForm.children"
              style="margin-bottom: 20px;"
              :key="childrenIndex">
              <el-row type="flex"
                justify="space-between">
                <el-col :span='9'>
                  <el-form-item label="label"
                    :prop="'children.' + childrenIndex + '.childrenLabel'"
                    :rules="{
                        required: true, message: 'label不能为空', trigger: 'blur'
                      }"
                    :label-width='lableWidth'>
                    <el-input v-model="v.childrenLabel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='9'>
                  <el-form-item label="value"
                    :prop="'children.' + childrenIndex + '.childrenValue'"
                    :rules="{
                        required: true, message: 'value不能为空', trigger: 'blur'
                      }"
                    :label-width='lableWidth'>
                    <el-input v-model="v.childrenValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='2'>
                  <div v-if="!v.state"
                    @click="handleRegion(childrenIndex)"
                    style="cursor: pointer;">设置地域</div>
                  <div v-if="v.state"
                    @click="handleRegion(childrenIndex)"
                    style="cursor: pointer;">取消地域</div>
                </el-col>
              </el-row>
              <el-row type="flex"
                style="margin-top:20px;"
                class="row-bg"
                justify="space-between"
                v-if="v.state">
                <el-col :span='5'>
                  <el-form-item label="所属省"
                    label-width='60px'
                    prop="provinceCode">
                    <el-select v-model="v.provinceCode"
                      @change="provinceChange(childrenIndex, v.provinceCode)"
                      placeholder="请选择">
                      <el-option v-for="item in province "
                        :key="item.id"
                        :label="item.positionName"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='5'>
                  <el-form-item label="所属市"
                    label-width='60px'
                    prop="cityCode">
                    <el-select v-model="v.cityCode"
                      @change="cityChange(childrenIndex, v.cityCode)"
                      placeholder="请选择">
                      <el-option v-for="item in v.city "
                        :key="item.id"
                        :label="item.positionName"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='5'>
                  <el-form-item label="所属区域"
                    label-width='70px'
                    prop="areaCode">
                    <el-select v-model="v.areaCode"
                      @change="regionChange(childrenIndex, v.areaCode)"
                      placeholder="请选择">
                      <el-option v-for="item in v.region "
                        :key="item.id"
                        :label="item.positionName"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='5'>
                  <el-form-item label="所属乡镇"
                    label-width='70px'
                    prop="township">
                    <el-select v-model="v.township"
                      multiple
                      @change="townshipChange(childrenIndex, v.township)"
                      placeholder="请选择">
                      <el-option v-for="item in v.Township "
                        :key="item.id"
                        :label="item.positionName"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row type="flex"
              justify="space-between">
              <el-col :span='11'>
                <el-button plain
                  type="primary"
                  @click="addParticipation">添加</el-button>
                <el-button plain
                  type="danger"
                  @click="deleteParticipation">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
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
              v-if="this.state === '3'"
              @click="handleSumbit('urlForm')">确 定</el-button>
            <el-button type="primary"
              v-else
              @click="handleSumbit('ruleForm')">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="选择父节点"
      :visible.sync="dialogTree"
      width="35%"
      center>
      <div>
        <el-tree :data="menuData"
          :check-strictly='true'
          show-checkbox
          :default-expanded-keys='this.menuDataExpanded'
          ref="fatherTree"
          node-key="id"
          :props="defaultProps"
          :highlight-current='true'></el-tree>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="12">
            <el-button @click="dialogTree = false">取 消</el-button>
            <el-button type="primary"
              @click="handleFatherTree">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'url',
  data () {
    return {
      // 省
      province: [],
      // 市
      city: [],
      // 区域
      region: [],
      // 乡镇
      Township: [],
      menuDataExpanded: [],
      form: {
        roleName: ''
      },
      // 岗位树数据
      menuData: [],
      // 选择岗位弹窗
      dialogTree: false,
      roleSelect: [],
      postSelect: [],
      urlForm: {
        children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }]
      },
      dialogWidth: '45%',
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
        roleId: '',
        postIds: '',
        url: ''
      },
      postId: [],
      rules: {
        url: [{ required: true, message: '请输入url', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色名称', trigger: 'change' }],
        postIds: [{ required: true, message: '请选择岗位名称', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增url',
      lableWidth: '95px',
      id: ''
    }
  },
  methods: {
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        this.$api.url.deleteBackendUrl({ id: val.id }).then(res => {
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
    provinceChange (childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.children[childrenIndex].city = res.data
          this.urlForm.children[childrenIndex].region = []
          this.urlForm.children[childrenIndex].Township = []
          this.urlForm.children[childrenIndex].cityCode = ''
          this.urlForm.children[childrenIndex].areaCode = ''
          this.urlForm.children[childrenIndex].township = ''
          if (this.urlForm.children[childrenIndex].township !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].township
            this.urlForm.children[childrenIndex].childrenLabel = 'township'
          } else if (this.urlForm.children[childrenIndex].areaCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].areaCode
            this.urlForm.children[childrenIndex].childrenLabel = 'area'
          } else if (this.urlForm.children[childrenIndex].cityCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].cityCode
            this.urlForm.children[childrenIndex].childrenLabel = 'city'
          } else if (this.urlForm.children[childrenIndex].provinceCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].provinceCode
            this.urlForm.children[childrenIndex].childrenLabel = 'province'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cityChange (childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.children[childrenIndex].region = res.data
          this.urlForm.children[childrenIndex].Township = []
          this.urlForm.children[childrenIndex].areaCode = ''
          this.urlForm.children[childrenIndex].township = ''
          if (this.urlForm.children[childrenIndex].township !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].township
            this.urlForm.children[childrenIndex].childrenLabel = 'township'
          } else if (this.urlForm.children[childrenIndex].areaCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].areaCode
            this.urlForm.children[childrenIndex].childrenLabel = 'area'
          } else if (this.urlForm.children[childrenIndex].cityCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].cityCode
            this.urlForm.children[childrenIndex].childrenLabel = 'city'
          } else if (this.urlForm.children[childrenIndex].provinceCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].provinceCode
            this.urlForm.children[childrenIndex].childrenLabel = 'province'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    regionChange (childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.children[childrenIndex].Township = res.data
          this.urlForm.children[childrenIndex].township = ''
          if (this.urlForm.children[childrenIndex].township !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].township
            this.urlForm.children[childrenIndex].childrenLabel = 'township'
          } else if (this.urlForm.children[childrenIndex].areaCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].areaCode
            this.urlForm.children[childrenIndex].childrenLabel = 'area'
          } else if (this.urlForm.children[childrenIndex].cityCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].cityCode
            this.urlForm.children[childrenIndex].childrenLabel = 'city'
          } else if (this.urlForm.children[childrenIndex].provinceCode !== '') {
            this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].provinceCode
            this.urlForm.children[childrenIndex].childrenLabel = 'province'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    townshipChange (childrenIndex, val) {
      if (this.urlForm.children[childrenIndex].township !== '') {
        // this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township
        this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].township.join('|')
        this.urlForm.children[childrenIndex].childrenLabel = 'township'
      } else if (this.urlForm.children[childrenIndex].areaCode !== '') {
        this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].areaCode
        this.urlForm.children[childrenIndex].childrenLabel = 'area'
      } else if (this.urlForm.children[childrenIndex].cityCode !== '') {
        this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].cityCode
        this.urlForm.children[childrenIndex].childrenLabel = 'city'
      } else if (this.urlForm.children[childrenIndex].provinceCode !== '') {
        this.urlForm.children[childrenIndex].childrenValue = this.urlForm.children[childrenIndex].provinceCode
        this.urlForm.children[childrenIndex].childrenLabel = 'province'
      }
    },
    handleRegion (childrenIndex) {
      this.urlForm.children[childrenIndex].state = !this.urlForm.children[childrenIndex].state
    },
    deleteParticipation () {
      if (this.urlForm.children[this.urlForm.children.length - 1].id !== '') {
        this.$api.url.deleteParameterById({ ids: this.urlForm.children[this.urlForm.children.length - 1].id.toString() }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.urlForm.children.splice(this.urlForm.children.length - 1, 1)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.urlForm.children.splice(this.urlForm.children.length - 1, 1)
      }
    },
    addParticipation () {
      this.urlForm.children.push({ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] })
    },
    handleFatherTree () {
      this.ruleForm.postIds = ''
      this.postId = []
      let arr = this.$refs.fatherTree.getCheckedNodes()
      arr.forEach(v => {
        this.ruleForm.postIds = this.ruleForm.postIds + ',' + v.postName
        this.postId.push(v.id)
      })
      this.ruleForm.postIds = this.ruleForm.postIds.substr(1)
      this.dialogTree = false
    },
    fatherTree () {
      this.dialogTree = true
      this.menuDataExpanded = this.postId
      // let fn = (arr) => {
      //   arr.forEach(v => {
      //     if (v.id === this.ruleForm.id) {
      //       v.disabled = true
      //       console.log(v)
      //     }
      //     if (v.children !== [] && v.children !== undefined) {
      //       return fn(v.children)
      //     }
      //   })
      // }
      // fn(this.menuData)
      // this.$nextTick(function () {
      //   this.$refs.fatherTree.setCurrentKey(this.ruleForm.fatherId)
      // })
      // this.menuDataExpanded[0] = this.ruleForm.fatherId
    },
    // 修改菜单
    handleRevisePwd (val, state) {
      this.state = state
      this.dialogWidth = '55%'
      this.dialogTitle = '设置后台链接'
      this.id = val.id
      this.dialog = true
      this.$api.url.getParameterListByUrl({ urlId: val.id }).then(res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            this.urlForm = {
              value: '', id: '', children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }]
            }
          } else {
            this.urlForm.children = []
            res.data.forEach(v => {
              let obj = {}
              obj.childrenLabel = v.name
              obj.id = v.id
              obj.urlId = v.urlId
              obj.childrenValue = v.value
              obj.state = false
              this.urlForm.children.push(obj)
            })
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleQuery () {
      this.initdata()
    },
    initdata () {
      // 初始化数据
      this.$api.url.getBackendUrlList({ pageNum: this.page, pageSize: this.limit }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取角色下拉
      this.$api.roleList.getRoleList({ pageNum: this.page, pageSize: this.limit, roleName: '' }).then(res => {
        if (res.code === 200) {
          this.roleSelect = res.data.list
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取组织
      this.$api.organizeList.getPostTreeList({ level: '', regionId: '' }).then(res => {
        if (res.code === 200) {
          this.menuData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取省
      this.$api.organizeList.getProvince().then(res => {
        if (res.code === 200) {
          this.province = res.data[0].children
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogWidth = '45%'
      this.dialogTitle = '新增url'
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
          if (this.state === '1') {
            // 根据id查数据
            let arr = [{}]
            arr[0].postId = this.postId.join(',')
            arr[0].roleId = this.ruleForm.roleId.join(',')
            arr[0].url = this.ruleForm.url
            this.$api.url.insertBackendUrl(arr).then(res => {
              if (res.code === 200) {
                this.dialog = false
                this.initdata()
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          if (this.state === '3') {
            let arr = []
            this.urlForm.children.forEach(v => {
              let obj = {}
              obj.name = v.childrenLabel
              obj.value = v.childrenValue
              obj.id = v.id
              obj.urlId = this.id
              arr.push(obj)
            })
            this.$api.url.insertParameter(arr).then(res => {
              if (res.code === 200) {
                this.dialog = false
                this.$message.success(res.msg)
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
</style>
