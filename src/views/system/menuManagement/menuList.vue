<template>
  <!-- 菜单列表 -->
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
          <el-table-column prop="id"
            label="ID"
            align="center"></el-table-column>
          <el-table-column prop="menuName"
            label="菜单名称"
            align="center"></el-table-column>
          <el-table-column prop="icon"
            label="图标"
            align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.icon === ''">暂无图标</i>
              <i :class="scope.row.icon"></i>
            </template>
          </el-table-column>
          <el-table-column prop="status"
            label="是否显示"
            align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'ENABLED'">显示</div>
              <div v-if="scope.row.status === 'DISABLED'">隐藏</div>
            </template>
          </el-table-column>
          <el-table-column prop="sort"
            label="排序"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="220px"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                v-has="{type: 'add'}"
                @click="handleAdds(scope.row, '1')"
                round>添加</el-button>
              <el-button size="mini"
                v-has="{type: 'update'}"
                @click="handleRevise(scope.row, '2')"
                round>编辑</el-button>
              <el-button size="mini"
                v-has="{type: 'link'}"
                @click="handleRevisePwd(scope.row, '3')"
                round>后台链接</el-button>
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
              <el-form-item label="菜单名称"
                :label-width='lableWidth'
                prop="menuName">
                <el-input v-model="ruleForm.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="菜单图标"
                :label-width='lableWidth'
                prop="icon">
                <el-select v-model="ruleForm.icon"
                  clearable
                  placeholder="请选择">
                  <el-option v-for="item in icon"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left;margin-right:15px;"
                      :class="item.value"></span>
                    <i style="float: left;margin-right:15px;font-size: 16px;line-height: 2;"
                      v-if="item.disabled"
                      class="el-icon-picture-outline"></i>
                    <span style="float: left; color: #8492a6; font-size: 15px;">{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="父菜单"
                :label-width='lableWidth'
                prop="fatherIds">
                <el-input v-model="ruleForm.fatherIds"
                  disabled
                  @click.native='fatherTree'></el-input>
                <!-- <el-cascader :options="menuData"
                  :change-on-select='true'
                  clearable
                  :props="props"
                  v-model="ruleForm.fatherIds">
                </el-cascader> -->
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="排序"
                :label-width='lableWidth'
                prop="sort">
                <el-input v-model.number="ruleForm.sort"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="url地址"
                :label-width='lableWidth'
                prop="url">
                <el-input v-model="ruleForm.url"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="菜单地址"
                :label-width='lableWidth'
                prop="component">
                <el-input v-model="ruleForm.component"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="所属系统"
                :label-width='lableWidth'
                prop="system">
                <el-radio-group v-model="ruleForm.system">
                  <el-radio :label="4">物资管理</el-radio>
                  <el-radio :label="1">营收系统</el-radio>
                  <el-radio :label="3">生产管理</el-radio>
                  <el-radio :label="2">运维管理</el-radio>
                  <el-radio :label="5">权限管理</el-radio>
                </el-radio-group>
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
            <el-col :span='11'>
              <el-form-item label="权限标签"
                :label-width='lableWidth'
                prop="lable">
                <el-input v-model="ruleForm.lable"></el-input>
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
          <div v-for="(item, index) in urlForm.url"
            :key="index">
            <el-row type="flex"
              justify="space-between">
              <el-col :span='18'>
                <el-form-item :label="'url' + (index *1 + 1)"
                  :prop="'url.' + index + '.value'"
                  :rules="{
                    required: true, message: 'URL不能为空', trigger: 'blur'
                  }"
                  :label-width='lableWidth'>
                  <el-input v-model="item.value"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='4'
                :offset="2">
                <el-button type="danger"
                  @click="deleteUrl(index, item.id)"
                  icon="el-icon-delete"
                  circle></el-button>
              </el-col>
            </el-row>
            <el-form-item label="入参"
              :label-width='lableWidth'>
              <div v-for="(v, childrenIndex) in item.children"
                style="margin-bottom: 20px;"
                :key="childrenIndex">
                <el-row type="flex"
                  justify="space-between">
                  <el-col :span='9'>
                    <el-form-item label="label"
                      :prop="'url.' + index + '.children.' + childrenIndex + '.childrenLabel'"
                      :rules="{
                        required: true, message: 'label不能为空', trigger: 'blur'
                      }"
                      :label-width='lableWidth'>
                      <el-input v-model="v.childrenLabel"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='9'>
                    <el-form-item label="value"
                      :prop="'url.' + index + '.children.' + childrenIndex + '.childrenValue'"
                      :rules="{
                        required: true, message: 'value不能为空', trigger: 'blur'
                      }"
                      :label-width='lableWidth'>
                      <el-input v-model="v.childrenValue"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span='2'>
                    <div v-if="!v.state"
                      @click="handleRegion(index, childrenIndex)"
                      style="cursor: pointer;">设置地域</div>
                    <div v-if="v.state"
                      @click="handleRegion(index, childrenIndex)"
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
                        @change="provinceChange(index, childrenIndex, v.provinceCode)"
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
                        @change="cityChange(index, childrenIndex, v.cityCode)"
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
                        @change="regionChange(index, childrenIndex, v.areaCode)"
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
                        @change="townshipChange(index, childrenIndex, v.township)"
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
                    @click="addParticipation(index)">添加</el-button>
                  <el-button plain
                    type="danger"
                    @click="deleteParticipation(index)">删除</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="12">
            <el-button type="primary"
              v-if="this.state === '3'"
              @click="handleAddUrl">新增链接</el-button>
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
          accordion
          ref="fatherTree"
          node-key="id"
          :props="fatherTreeProps"
          :highlight-current='true'
          :default-expanded-keys=this.menuDataExpanded
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
export default {
  name: 'menuList',
  data () {
    return {
      icon: [{
        value: 'iconfont iconxunjianjihua',
        label: 'iconfont iconxunjianjihua'
      },
      {
        value: 'iconfont iconshuijiashezhi',
        label: 'iconfont iconshuijiashezhi'
      },
      {
        value: 'iconfont iconyw_tongjifenxi',
        label: 'iconfont iconyw_tongjifenxi'
      },
      {
        value: 'iconfont iconcaigouguanli',
        label: 'iconfont iconcaigouguanli'
      },
      {
        value: 'iconfont iconyonghuliebiao',
        label: 'iconfont iconyonghuliebiao'
      },
      {
        value: 'iconfont iconxitongshezhi',
        label: 'iconfont iconxitongshezhi'
      },
      {
        value: 'iconfont iconshoufeiguanli',
        label: 'iconfont iconshoufeiguanli'
      },
      {
        value: 'iconfont iconys_tongjifenxi',
        label: 'iconfont iconys_tongjifenxi'
      },
      {
        value: 'iconfont iconcaidanguanli',
        label: 'iconfont iconcaidanguanli'
      },
      {
        value: 'iconfont iconjiankongbaojing',
        label: 'iconfont iconjiankongbaojing'
      },
      {
        value: 'iconfont iconshishijiankong',
        label: 'iconfont iconshishijiankong'
      },
      {
        value: 'iconfont iconjiaoseguanli',
        label: 'iconfont iconjiaoseguanli'
      },
      {
        value: 'iconfont iconshijianbanli',
        label: 'iconfont iconshijianbanli'
      },
      {
        value: 'iconfont iconshijianshangbao',
        label: 'iconfont iconshijianshangbao'
      },
      {
        value: 'iconfont iconzuzhiguanli',
        label: 'iconfont iconzuzhiguanli'
      },
      {
        value: 'iconfont iconxitongzonglan',
        label: 'iconfont iconxitongzonglan'
      },
      {
        value: 'iconfont icongongdanchuli',
        label: 'iconfont icongongdanchuli'
      },
      {
        value: 'iconfont iconkucunwuziguanli',
        label: 'iconfont iconkucunwuziguanli'
      },
      {
        value: 'iconfont iconshijianbanli1',
        label: 'iconfont iconshijianbanli1'
      },
      {
        value: 'iconfont iconbiaojiguanli',
        label: 'iconfont iconbiaojiguanli'
      },
      {
        value: '1',
        label: '供水调度',
        disabled: true
      },
      {
        value: '2',
        label: '营收系统',
        disabled: true
      },
      {
        value: '3',
        label: '物资管理',
        disabled: true
      },
      {
        value: '4',
        label: '运维管理',
        disabled: true
      },
      {
        value: '5',
        label: '生产管理',
        disabled: true
      },
      {
        value: '6',
        label: '系统设置',
        disabled: true
      }
      ],
      menuDataExpanded: [],
      dialogTree: false,
      selectTree: { lable: '', id: null },
      aa: ['上海', '北京', '广州', '深圳'],
      menuData: [],
      dialogWidth: '45%',
      roleForm: {
        a: []
      },
      urlForm: {
        url: [
          { value: '', id: '', children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }] }
        ]
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      ruleForm: {
        id: '',
        menuName: '',
        icon: '',
        fatherId: 0,
        sort: '',
        url: '',
        component: '',
        system: '',
        status: '',
        lable: '',
        fatherIds: ''
      },
      rules: {
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'change' }]
        // icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
        // sort: [{ required: true, message: '请输入排序', trigger: 'change' }, { type: 'number', message: '排序必须为数字值' }],
        // url: [{ required: true, message: '请输入url地址', trigger: 'change' }],
        // component: [{ required: true, message: '请输入菜单地址', trigger: 'change' }],
        // system: [{ required: true, message: '请选择所属系统', trigger: 'change' }],
        // status: [{ required: true, message: '请选择是否显示', trigger: 'change' }],
        // lable: [{ required: true, message: '请输入权限标识', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增菜单',
      lableWidth: '95px',
      // 供应商分类数据
      supplierData: [],
      productNameData: [],
      fatherTreeProps: {
        value: 'id',
        label: 'menuName'
      },
      // 省
      province: [],
      // 市
      city: [],
      // 区域
      region: [],
      // 乡镇
      Township: [],
      id: ''
    }
  },
  methods: {
    provinceChange (index, childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.url[index].children[childrenIndex].city = res.data
          this.urlForm.url[index].children[childrenIndex].region = []
          this.urlForm.url[index].children[childrenIndex].Township = []
          this.urlForm.url[index].children[childrenIndex].cityCode = ''
          this.urlForm.url[index].children[childrenIndex].areaCode = ''
          this.urlForm.url[index].children[childrenIndex].township = ''
          if (this.urlForm.url[index].children[childrenIndex].township !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属乡镇'
          } else if (this.urlForm.url[index].children[childrenIndex].areaCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].areaCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属区域'
          } else if (this.urlForm.url[index].children[childrenIndex].cityCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].cityCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属市'
          } else if (this.urlForm.url[index].children[childrenIndex].provinceCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].provinceCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属省'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cityChange (index, childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.url[index].children[childrenIndex].region = res.data
          this.urlForm.url[index].children[childrenIndex].Township = []
          this.urlForm.url[index].children[childrenIndex].areaCode = ''
          this.urlForm.url[index].children[childrenIndex].township = ''
          if (this.urlForm.url[index].children[childrenIndex].township !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属乡镇'
          } else if (this.urlForm.url[index].children[childrenIndex].areaCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].areaCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属区域'
          } else if (this.urlForm.url[index].children[childrenIndex].cityCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].cityCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属市'
          } else if (this.urlForm.url[index].children[childrenIndex].provinceCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].provinceCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属省'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    regionChange (index, childrenIndex, val) {
      this.$api.organizeList.getRegionByCode({ code: val }).then(res => {
        if (res.code === 200) {
          this.urlForm.url[index].children[childrenIndex].Township = res.data
          this.urlForm.url[index].children[childrenIndex].township = ''
          if (this.urlForm.url[index].children[childrenIndex].township !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属乡镇'
          } else if (this.urlForm.url[index].children[childrenIndex].areaCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].areaCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属区域'
          } else if (this.urlForm.url[index].children[childrenIndex].cityCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].cityCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属市'
          } else if (this.urlForm.url[index].children[childrenIndex].provinceCode !== '') {
            this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].provinceCode
            this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属省'
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    townshipChange (index, childrenIndex, val) {
      if (this.urlForm.url[index].children[childrenIndex].township !== '') {
        // this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township
        this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].township.join('|')
        this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属乡镇'
      } else if (this.urlForm.url[index].children[childrenIndex].areaCode !== '') {
        this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].areaCode
        this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属区域'
      } else if (this.urlForm.url[index].children[childrenIndex].cityCode !== '') {
        this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].cityCode
        this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属市'
      } else if (this.urlForm.url[index].children[childrenIndex].provinceCode !== '') {
        this.urlForm.url[index].children[childrenIndex].childrenValue = this.urlForm.url[index].children[childrenIndex].provinceCode
        this.urlForm.url[index].children[childrenIndex].childrenLabel = '所属省'
      }
    },
    handleRegion (index, childrenIndex) {
      this.urlForm.url[index].children[childrenIndex].state = !this.urlForm.url[index].children[childrenIndex].state
    },
    deleteUrl (index, id) {
      this.urlForm.url.splice(index, 1)
      if (id !== '') {
        this.$api.menuList.deleteBackendUrl({ id: id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    deleteParticipation (index) {
      if (this.urlForm.url[index].children[this.urlForm.url[index].children.length - 1].id !== '') {
        this.$api.menuList.deleteParameterById({ ids: this.urlForm.url[index].children[this.urlForm.url[index].children.length - 1].id.toString() }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.urlForm.url[index].children.splice(this.urlForm.url[index].children.length - 1, 1)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.urlForm.url[index].children.splice(this.urlForm.url[index].children.length - 1, 1)
      }
    },
    handleAddUrl () {
      this.urlForm.url.push({ value: '', id: '', children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }] })
    },
    addParticipation (index) {
      this.urlForm.url[index].children.push({ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] })
    },
    handleAdds (val, state) {
      this.dialogWidth = '45%'
      this.dialogTitle = '新增菜单'
      this.dialog = true
      this.state = state
      this.ruleForm.fatherIds = val.menuName
      this.ruleForm.fatherId = val.id
      this.ruleForm.system = val.system
      console.log(val)
    },
    handleFatherTree () {
      this.ruleForm.fatherIds = this.selectTree.lable
      this.ruleForm.fatherId = this.selectTree.id
      this.dialogTree = false
    },
    handleNodeClick (data) {
      this.selectTree.lable = ''
      this.selectTree.id = null
      this.selectTree.lable = data.menuName
      this.selectTree.id = data.id
    },
    fatherTree () {
      this.dialogTree = true
      this.$nextTick(function () {
        this.$refs.fatherTree.setCurrentKey(this.ruleForm.fatherId)
      })
      this.menuDataExpanded[0] = this.ruleForm.fatherId
    },
    // 修改菜单
    handleRevisePwd (val, state) {
      this.state = state
      this.dialogWidth = '55%'
      this.dialogTitle = '设置后台链接'
      this.id = val.id
      this.dialog = true
      // urlForm: {
      //   url: [
      //     { value: '', children: [{ childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }] }
      //   ]
      // },
      this.$api.menuList.getBackendUrlListByMenuId({ menuId: this.id }).then(res => {
        if (res.code === 200) {
          if (res.data.length === 0) {
            this.urlForm.url = [
              { value: '', id: '', children: [{ id: '', urlId: '', childrenLabel: '', childrenValue: '', provinceCode: '', cityCode: '', areaCode: '', township: '', state: false, province: this.province, city: [], region: [], Township: [] }] }
            ]
          } else {
            this.urlForm.url = []
            res.data.forEach(v => {
              let obj = {}
              obj.children = []
              obj.value = v.url
              obj.id = v.id
              this.$api.menuList.getParameterListByUrl({ urlId: v.id }).then(ress => {
                if (ress.code === 200) {
                  ress.data.forEach(v => {
                    let objs = {}
                    objs.childrenLabel = v.name
                    objs.id = v.id
                    objs.urlId = v.urlId
                    objs.childrenValue = v.value
                    objs.state = false
                    obj.children.push(objs)
                  })
                } else {
                  this.$message.error(ress.msg)
                }
              })
              this.urlForm.url.push(obj)
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
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        this.$api.menuList.deleteMenuById({ id: val.id }).then(res => {
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
      this.$api.menuList.getMenuList({ lable: '', system: '' }).then(res => {
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
      this.dialogTitle = '新增菜单'
      this.dialog = true
      this.state = val
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogWidth = '45%'
      this.dialogTitle = '修改菜单'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.menuList.getMenuById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          // this.ruleForm.fatherIds = res.data.fatherId
          let fn = (arr) => {
            arr.forEach(v => {
              if (v.id === res.data.fatherId) {
                this.ruleForm.fatherIds = v.menuName
                return true
              } else {
                if (v.children !== undefined) {
                  return fn(v.children)
                }
              }
            })
          }
          fn(this.menuData)
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
          let { menuName, icon, fatherId, sort, url, component, system, status, lable, id } = this.ruleForm
          // 新增
          if (this.state === '1') {
            let obj = { menuName, icon, fatherId, sort, url, component, system, status, lable }
            this.$api.menuList.insertMenu(obj).then(res => {
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
            let obj = { menuName, icon, fatherId, sort, url, component, system, status, lable, id }
            this.$api.menuList.updateMenu(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          // 123
          if (this.state === '3') {
            let arr = []
            this.urlForm.url.forEach(v => {
              let obj = {}
              obj.url = v.value
              obj.menuId = this.id
              obj.id = v.id
              obj.parametersEntityList = []
              v.children.forEach(val => {
                let objs = {}
                objs.name = val.childrenLabel
                objs.value = val.childrenValue
                objs.id = val.id
                objs.urlId = val.urlId
                obj.parametersEntityList.push(objs)
              })
              arr.push(obj)
            })
            if (arr[0].id === '') {
              this.$api.menuList.insertBackendUrl(arr).then(res => {
                if (res.code === 200) {
                  this.$message.success(res.msg)
                  this.dialog = false
                  this.initdata()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              this.$api.menuList.updateBackendUrl(arr).then(res => {
                if (res.code === 200) {
                  this.$message.success(res.msg)
                  this.dialog = false
                  this.initdata()
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
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
        this.ruleForm.fatherIds = ''
        this.ruleForm.fatherId = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inner /deep/ .el-cascader {
  width: 100%;
  display: block;
}
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
