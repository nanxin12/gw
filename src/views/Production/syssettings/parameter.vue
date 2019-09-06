<template>
  <div>
    <el-form :inline="true" :model="formInline" label-width="100px" label-position="right">
      <el-form-item label="参数类型:">
        <el-select v-model="formInline.typeEnum" placeholder="请选择">
          <el-option v-for="item in typeNmaeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="站点名称:">
        <el-select v-model="formInline.stationId" placeholder="请选择">
          <el-option v-for="item in stationLists" :key="item.name" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData">查找</el-button>
        <el-button v-has="{type: 'add'}" type="primary" @click="addData">添加</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" class="tables" stripe border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="参数类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.typeEnum === 'LIQUID_LEVEL'">液位</span>
              <span v-if="scope.row.typeEnum === 'PRESSURE'">压力</span>
              <span v-if="scope.row.typeEnum === 'BALANCE_OF_CL'">余氯</span>
              <span v-if="scope.row.typeEnum === 'PH'">PH值</span>
              <span v-if="scope.row.typeEnum === 'VOLTAGE'">电压</span>
            </template>
          </el-table-column>
          <el-table-column prop="minNum" label="最小值" align="center"></el-table-column>
          <el-table-column prop="maxNum" label="最大值" align="center"></el-table-column>
          <el-table-column prop="nuit" label="单位" align="center"></el-table-column>
          <el-table-column prop="name" label="站点名称" align="center"></el-table-column>
          <el-table-column prop="rtuName" label="设备名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-has="{type: 'update'}" type="success" style="margin: 5px" plain round size="mini" @click="updata(scope.row)">编辑</el-button>
              <el-button v-has="{type: 'delete'}" type="danger" style="margin: 5px" plain round size="mini" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align="center" @size-change="handleSizeChange" @current-change="handleCurrentChanges"
                       :current-page="formInline.page" :page-sizes="[10, 20, 30, 40]"
                       :page-size="formInline.size" layout="total, sizes, prev, pager, next, jumper"
                       :total="formInline.eltotalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="titleDid" :visible.sync="Dig" @opened="openDig" @close="closeDig" width="40%">
      <el-form :model="parameterForm" :rules="parameterRules" ref="parameterRef" label-width="90px">
        <el-row v-show="!updatas" style="margin-bottom: 5px">
          <span>{{stationName}}</span> - <span>{{rtuName}}</span>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参数名称:" prop="typeEnum">
              <el-select v-model="parameterForm.typeEnum" @change="initStation" placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in typeNmaeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位:" prop="nuit">
              <el-input v-model="parameterForm.nuit" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小值:" prop="minNum">
              <el-input v-model="parameterForm.minNum" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值:" prop="maxNum">
              <el-input v-model="parameterForm.maxNum" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="updatas">
          <el-col :span="24">
            <el-tree :data="treeData" style="height: 300px;overflow: auto" show-checkbox node-key="id" ref="tree" :props="defaultProps"></el-tree>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right;margin-top:20px">
          <el-button type="primary" @click="typeSubmit('parameterRef')">确定
          </el-button>
          <el-button @click="Dig = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  typeEnum: 'parameter',
  data () {
    let parameterMinNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('参数不能为空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('参数格式不正确'))
        } else {
          if (this.parameterForm.maxNum) {
            this.$refs.parameterRef.validateField('bigNum')
          }
          callback()
        }
      }
    }
    let parameterMaxNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('参数不能为空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('参数格式不正确'))
        } else if (this.parameterForm.minNum && (this.parameterForm.minNum >= this.parameterForm.maxNum)) {
          callback(new Error('最小值不能大于等于最大值'))
        } else {
          callback()
        }
      }
    }
    return {
      stationName: null,
      rtuName: null,
      updatas: false,
      stationLists: [],
      formInline: {
        stationId: null,
        typeEnum: null,
        page: 1,
        size: 10,
        eltotalCount: 0
      },
      typeNmaeList: [
        { name: '液位', value: 'LIQUID_LEVEL' },
        { name: '压力', value: 'PRESSURE' },
        { name: '余氯', value: 'BALANCE_OF_CL' },
        { name: 'PH值', value: 'PH' },
        { name: '电压', value: 'VOLTAGE' }
      ],
      tableData: [],
      Dig: false,
      titleDid: '',
      parameterForm: {
        rtuId: null,
        id: null,
        typeEnum: null,
        maxNum: null,
        minNum: null,
        nuit: null
      },
      temporary: {},
      parameterRules: {
        typeEnum: [{ required: true, message: '请输入参数名称', trigger: 'change' }],
        maxNum: [{ required: true, validator: parameterMaxNum, trigger: 'blur' }],
        minNum: [{ required: true, validator: parameterMinNum, trigger: 'blur' }],
        nuit: [{ required: true, message: '请输入参数单位', trigger: 'blur' }]
      },
      // 默认数据结构
      defaultProps: {
        children: 'rtus',
        label: 'stationName'
      },
      // 树的数据
      treeData: []
    }
  },
  created () {
    this.initData()
    this.initAllStation()
  },
  methods: {
    async initAllStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationLists = res.data
      } else this.$message.error('站点数据获取失败')
    },
    async initStation (val) {
      if (this.titleDid === '添加参数') {
        let res = await this.$api.product.getParameterStation({ sensorType: val })
        if (res.code === 200) {
          res.data.forEach(item => {
            item.rtus.forEach(items => {
              items.stationName = items.rtuName
            })
          })
          this.treeData = res.data
        } else this.$message.error('站点数据获取失败')
      }
    },
    openDig () {
      if (this.titleDid === '修改参数') {
        let { id, typeEnum, maxNum, minNum, nuit, name, rtuName, rtuId } = this.temporary
        this.parameterForm.id = id
        this.parameterForm.typeEnum = typeEnum
        this.parameterForm.maxNum = maxNum
        this.parameterForm.minNum = minNum
        this.parameterForm.nuit = nuit
        this.parameterForm.rtuId = rtuId
        this.rtuName = rtuName
        this.stationName = name
      }
    },
    typeSubmit (formtypeEnum) {
      let tree = this.$refs.tree.getCheckedNodes() // 获取勾选数据
      this.$refs[formtypeEnum].validate(async (valid) => {
        if (valid) {
          if (this.titleDid === '添加参数') {
            if (tree.length) {
              let arr = []
              tree.forEach(item => item.rtuId && arr.push(item.rtuId))
              let data = JSON.parse(JSON.stringify(this.parameterForm))
              data.rtuIds = arr.join(',')
              delete data.rtuId
              delete data.id
              let res = await this.$api.product.addParameter(data)
              if (res.code === 200) {
                this.$message.success('添加成功')
                this.Dig = false
                this.initData()
              } else this.$message.error('添加失败')
            } else this.$message.error('请选择对应的设备')
          } else {
            let res = await this.$api.product.putParameter(this.parameterForm)
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
      this.$refs.parameterRef.resetFields()
      this.treeData = []
      this.updatas = false
    },
    async initData () {
      let res = await this.$api.product.getParameter(this.formInline)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.formInline.eltotalCount = res.data.totalCount
      } else {
        this.$message.error('数据获取失败')
      }
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (Object.is(rowIndex, 0)) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    addData () {
      this.Dig = true
      this.titleDid = '添加参数'
      this.updatas = true
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.formInline.size = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.formInline.page = values
      this.initData()
    },
    reset () {
      this.formInline.stationId = null
      this.formInline.typeEnum = null
      this.initData()
    },
    updata ({ id, typeEnum, maxNum, minNum, nuit, name, rtuName, rtuId }) {
      this.Dig = true
      this.titleDid = '修改参数'
      this.temporary = { id, typeEnum, maxNum, minNum, nuit, name, rtuName, rtuId }
    },
    del (id) {
      this.$confirm('此操作将删除参数', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.product.delParameter({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => false)
    }
  }
}
</script>

<style lang="scss" scoped>
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
