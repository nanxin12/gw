<template>
  <!-- 组织列表 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-button type="success"
        v-has="{type: 'add'}"
        icon="el-icon-circle-plus-outline"
        @click="handleAdd('1')">添加</el-button>
    </div>
    <!-- 中间内容 -->
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          border
          row-key="id"
          :header-cell-style="tableHeaderColor">
          <el-table-column label="序号"
            align="center"
            width="auto">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="postName"
            label="岗位名称"
            align="center"></el-table-column>
          <el-table-column prop="level"
            label="地级"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.level === 0">国</div>
              <div v-if="scope.row.level === 1">省</div>
              <div v-if="scope.row.level === 2">市</div>
              <div v-if="scope.row.level === 3">区</div>
              <div v-if="scope.row.level === 3">乡/镇</div>
            </template>
          </el-table-column>
          <el-table-column prop="status"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'ENABLED'">显示</div>
              <div v-if="scope.row.status === 'DISABLED'">隐藏</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"
            label="创建时间"
            :formatter="formatter"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                v-has="{type: 'update'}"
                @click="handleRevise(scope.row, '2')"
                round>编辑</el-button>
              <el-button size="mini"
                @click="handleRevisePwd(scope.row, '3')"
                round>后台链接</el-button>
              <el-button size="mini"
                v-if="false"
                @click="handleMenu(scope.row, '4')"
                round>授权</el-button>
              <el-button size="mini"
                v-has="{type: 'delete'}"
                @click="handleDelete(scope.row)"
                round>删除</el-button>
              <div>{{scope.a}}</div>
            </template>
          </el-table-column>
        </el-table>
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
              <el-form-item label="上级岗位"
                prop="fatherIds"
                :label-width='lableWidth'>
                <el-input v-model="ruleForm.fatherIds"
                  disabled
                  @click.native='fatherTree'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="岗位名称"
                :label-width='lableWidth'
                prop="postName">
                <el-input v-model="ruleForm.postName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="所属省"
                :label-width='lableWidth'
                prop="provinceCode">
                <el-select v-model="ruleForm.provinceCode"
                  @change="provinceChange"
                  placeholder="请选择">
                  <el-option v-for="item in province "
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="所属市"
                :label-width='lableWidth'
                prop="cityCode">
                <el-select v-model="ruleForm.cityCode"
                  @change="cityChange"
                  placeholder="请选择">
                  <el-option v-for="item in city "
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="所属区域"
                :label-width='lableWidth'
                prop="areaCode">
                <el-select v-model="ruleForm.areaCode"
                  @change="regionChange"
                  placeholder="请选择">
                  <el-option v-for="item in region "
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="所属乡镇"
                :label-width='lableWidth'
                prop="township">
                <el-select v-model="ruleForm.township"
                  @change="townshipChange"
                  placeholder="请选择">
                  <el-option v-for="item in Township "
                    :key="item.id"
                    :label="item.positionName"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="是否显示"
                :label-width='lableWidth'
                prop="status">
                <el-switch v-model="ruleForm.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="ENABLED"
                  inactive-value="DISABLED">
                </el-switch>
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
                      @change="provinceChanges(childrenIndex, v.provinceCode)"
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
                      @change="cityChanges(childrenIndex, v.cityCode)"
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
                      @change="regionChanges(childrenIndex, v.areaCode)"
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
                      @change="townshipChanges(childrenIndex, v.township)"
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
      <!-- 设置菜单 -->
      <div v-if="this.state === '4'">
        <el-tree :data="setupMenuTreeData"
          show-checkbox
          :default-checked-keys='checkedData'
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="setupMenuTreeProps">
        </el-tree>
      </div>
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
          :default-expanded-keys=this.menuDataExpanded
          ref="fatherTree"
          node-key="id"
          :props="fatherTreeProps"
          :highlight-current='true'
          @node-click="handleNodeClick"></el-tree>
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
import setTime from '@/assets/js/setTime'
export default {
  name: 'organizeList',
  data () {
    return {
      urlForm: {
        children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }]
      },
      menuDataExpanded: [],
      // 设置菜单树数据
      setupMenuTreeData: [],
      // 设置菜单树Props
      setupMenuTreeProps: {
        children: 'children',
        label: 'menuName'
      },
      // --------------------------------------------------
      // 树回选数据
      checkedData: [],
      // 上级岗位树数据
      menuData: [],
      selectTree: { lable: '', id: null },
      // 上级岗位树Props
      fatherTreeProps: {
        value: 'id',
        label: 'postName'
      },
      // 上级岗位弹窗
      dialogTree: false,
      // --------------------------------------------------
      dialogWidth: '45%',
      tableData: [],
      ruleForm: {
        id: '',
        fatherId: '',
        fatherIds: '',
        postName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        township: '',
        status: 'ENABLED',
        regionId: ''
      },
      // 验证
      rules: {
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }],
        // provinceCode: [{ required: true, message: '请选择省', trigger: 'change' }],
        // cityCode: [{ required: true, message: '请选择市', trigger: 'change' }],
        // areaCode: [{ required: true, message: '请选择区域', trigger: 'change' }],
        // township: [{ required: true, message: '请选择乡镇', trigger: 'change' }],
        status: [{ required: true, message: '请选择是否显示', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增用户',
      lableWidth: '95px',
      // 省
      province: [],
      // 市
      city: [],
      // 区域
      region: [],
      // 乡镇
      Township: []
    }
  },
  methods: {
    // 修改菜单
    handleRevisePwd (val, state) {
      this.state = state
      this.dialogWidth = '55%'
      this.dialogTitle = '设置后台链接'
      this.id = val.id
      this.dialog = true
      this.$api.organizeList.getPostParameterByParameterId({ parameterId: val.id }).then(res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            this.urlForm = {
              children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }]
            }
          } else {
            this.urlForm.children = []
            res.data.forEach(v => {
              let obj = {}
              obj.childrenLabel = v.name
              obj.id = v.id
              obj.postId = v.postId
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
    provinceChanges (childrenIndex, val) {
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
    cityChanges (childrenIndex, val) {
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
    regionChanges (childrenIndex, val) {
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
    townshipChanges (childrenIndex, val) {
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
        console.log(this.urlForm.children[this.urlForm.children.length - 1])
        this.$api.organizeList.deletePostParameterById({ parameterId: this.urlForm.children[this.urlForm.children.length - 1].id.toString() }).then(res => {
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
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000 })
      } else {
        return '暂无数据'
      }
    },
    handleFatherTree () {
      this.ruleForm.fatherIds = this.selectTree.lable
      this.ruleForm.fatherId = this.selectTree.id
      this.dialogTree = false
    },
    handleNodeClick (data) {
      this.selectTree.lable = ''
      this.selectTree.id = null
      this.selectTree.lable = data.postName
      this.selectTree.id = data.id
    },
    fatherTree () {
      this.dialogTree = true
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
      this.$nextTick(function () {
        this.$refs.fatherTree.setCurrentKey(this.ruleForm.fatherId)
      })
      this.menuDataExpanded[0] = this.ruleForm.fatherId
    },
    provinceChange (val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.city = res.data
          this.region = []
          this.Township = []
          this.ruleForm.cityCode = ''
          this.ruleForm.areaCode = ''
          this.ruleForm.township = ''
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cityChange (val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.region = res.data
          this.Township = []
          this.ruleForm.areaCode = ''
          this.ruleForm.township = ''
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    regionChange (val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.Township = res.data
          this.ruleForm.township = ''
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    townshipChange (val) {
      this.$set(this.ruleForm, 'township', val)
    },
    // 分配角色
    handleMenu (val, state) {
      this.dialogWidth = '35%'
      this.state = state
      this.dialogTitle = '设置菜单'
      this.dialog = true
      // 获取菜单树
      this.$api.roleList.getMenuTree({ roleId: val.id, userId: 1 }).then(res => {
        if (res.code === 200) {
          this.setupMenuTreeData = res.data
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
          fn(this.setupMenuTreeData)
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
        this.$api.organizeList.deletePostByIds({ ids: val.id }).then(res => {
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
      this.$api.organizeList.getPostTreeList({ level: '', regionId: '' }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
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
      this.$api.organizeList.getPostById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          let fn = (arr) => {
            arr.forEach(v => {
              if (v.id === res.data.fatherId) {
                this.ruleForm.fatherIds = v.postName
                return true
              } else {
                if (v.children !== undefined) {
                  return fn(v.children)
                }
              }
            })
          }
          fn(this.menuData)
          if (this.ruleForm.provinceCode) {
            this.ruleForm.provinceCode = Number(this.ruleForm.provinceCode)
            this.ruleForm.cityCode = Number(this.ruleForm.cityCode)
            this.ruleForm.areaCode = Number(this.ruleForm.areaCode)
            this.ruleForm.township = Number(this.ruleForm.township)
            let a = () => {
              return new Promise((resolve, reject) => {
                this.$api.organizeList.getRegionByCode({ code: this.ruleForm.provinceCode }).then(res => {
                  if (res.code === 200) {
                    this.city = res.data
                    resolve()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              })
            }
            let b = () => {
              return new Promise((resolve, reject) => {
                this.$api.organizeList.getRegionByCode({ code: this.ruleForm.cityCode }).then(res => {
                  if (res.code === 200) {
                    this.region = res.data
                    resolve()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              })
            }
            let c = () => {
              return new Promise((resolve, reject) => {
                this.$api.organizeList.getRegionByCode({ code: this.ruleForm.areaCode }).then(res => {
                  if (res.code === 200) {
                    this.Township = res.data
                    resolve()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
              })
            }
            let citiData = async () => {
              await a()
              await b()
              await c()
            }
            citiData()
          } else {
            this.$set(this.ruleForm, 'provinceCode', '')
            this.$set(this.ruleForm, 'cityCode', '')
            this.$set(this.ruleForm, 'areaCode', '')
            this.$set(this.ruleForm, 'township', '')
          }
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
          let { id, fatherId, postName, provinceCode, cityCode, areaCode, township, status, regionId } = this.ruleForm
          // regionId = '640400000000'
          // 新增
          if (township !== '') {
            regionId = township
          } else if (areaCode !== '') {
            regionId = areaCode
          } else if (cityCode !== '') {
            regionId = cityCode
          } else if (provinceCode !== '') {
            regionId = provinceCode
          }
          if (this.state === '1') {
            let obj = { fatherId, postName, provinceCode, cityCode, areaCode, township, status, regionId }
            this.$api.organizeList.insertPost(obj).then(res => {
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
            let obj = { id, fatherId, postName, provinceCode, cityCode, areaCode, township, status, regionId }
            this.$api.organizeList.updatePost(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
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
              obj.postId = this.id
              arr.push(obj)
            })
            this.$api.organizeList.insertPostParameter(arr).then(res => {
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
