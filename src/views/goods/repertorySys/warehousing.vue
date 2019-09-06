<template>
  <!-- 入库管理 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="入库时间"
          label-width="70px">
          <el-date-picker v-model="form.applyTime"
            value-format="timestamp"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品名称"
          label-width="70px">
          <el-input v-model="form.productName"
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
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="storageNum"
            label="入库单号"
            align="center"></el-table-column>
          <el-table-column prop="productName"
            label="产品名称"
            align="center"></el-table-column>
          <el-table-column prop="productclassifi"
            label="产品分类"
            align="center"></el-table-column>
          <el-table-column prop="productspec"
            label="产品规格"
            align="center"></el-table-column>
          <el-table-column prop="productCompany"
            label="单位"
            align="center"></el-table-column>
          <el-table-column prop="storageSource"
            label="产品来源"
            align="center"></el-table-column>
          <el-table-column prop="warehouseName"
            label="所存仓库"
            align="center"></el-table-column>
          <el-table-column prop="checkNum"
            label="验收单号"
            align="center">
            <template slot-scope="scope">
              <div>{{scope.row.checkNum || '暂无单号'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="applicatNum"
            label="申请单号"
            align="center">
            <template slot-scope="scope">
              <div>{{scope.row.applicatNum || '暂无单号'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="storageTotalNum"
            label="入库数量"
            align="center"></el-table-column>
          <el-table-column prop="storagePeople"
            label="入库人"
            align="center"></el-table-column>
          <el-table-column prop="storageTime"
            :formatter='formatter'
            label="入库时间"
            align="center"></el-table-column>
          <el-table-column prop="stoRemarks"
            label="备注"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="130px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'update'}"
                @click="handleRevise(scope.row, '2')">修改</el-button>
              <el-button type="danger"
                plain
                round
                size="mini"
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
      width="45%"
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
            <el-form-item label="物资来源"
              :label-width='lableWidth'>
              <el-radio v-model="ruleForm.storageSource"
                label="订单采购">订单采购</el-radio>
              <el-radio v-model="ruleForm.storageSource"
                label="物资退回">物资退回</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="入库单号"
              :label-width='lableWidth'>
              <el-input v-model="ruleForm.storageNum"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'
            v-if="this.ruleForm.storageSource === '订单采购'">
            <el-form-item label="验收单号"
              :label-width='lableWidth'
              prop="checkNum">
              <el-select v-model="ruleForm.checkNum"
                @change="checkNumberChange"
                :disabled="storageSourceDisabled"
                placeholder="请选择">
                <el-option v-for="item in checkNumber "
                  :key="item.id"
                  :label="item.checkNum"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='11'
            v-if="this.ruleForm.storageSource === '物资退回'">
            <el-form-item label="申请单号"
              :label-width='lableWidth'
              prop="checkNum">
              <el-select v-model="ruleForm.applicatNum"
                @change="applicatNumberChange"
                placeholder="请选择">
                <el-option v-for="item in applicatNums "
                  :key="item.applicatNum"
                  :label="item.applicatNum"
                  :value="item.applicatNum">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="产品名称"
              :label-width='lableWidth'
              prop="productName">
              <el-select v-model="ruleForm.productName"
                @change="productNameChange"
                :disabled="true"
                placeholder="请选择">
                <el-option v-for="item in productNameData "
                  :key="item.id"
                  :label="item.productName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="产品规格"
              :label-width='lableWidth'
              prop="productspec">
              <el-input v-model="ruleForm.productspec"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="单位"
              :label-width='lableWidth'
              prop="productCompany">
              <el-input v-model="ruleForm.productCompany"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="产品分类"
              :label-width='lableWidth'
              prop="productclassifi">
              <el-input v-model="ruleForm.productclassifi"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="入库数量"
              :label-width='lableWidth'
              prop="storageTotalNum">
              <el-input v-model.number="ruleForm.storageTotalNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="所属仓库"
              :label-width='lableWidth'
              prop="warehouseName">
              <el-select v-model="ruleForm.warehouseName"
                placeholder="请选择">
                <el-option v-for="item in warehouse "
                  :key="item.id"
                  :label="item.whouseName"
                  :value="item.whouseName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="入库人"
              :label-width='lableWidth'
              prop="storagePeople">
              <el-input v-model.number="ruleForm.storagePeople"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="入库时间"
              :label-width='lableWidth'
              prop="storageTime">
              <el-date-picker v-model="ruleForm.storageTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row type="flex"
          justify="space-between">
          <el-col :span='24'>
            <el-form-item label="备注"
              :label-width='lableWidth'
              prop="stoRemarks">
              <el-input v-model="ruleForm.stoRemarks"
                type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="8">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary"
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
  name: 'warehousing',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        storageSource: '订单采购',
        storageNum: '',
        checkNum: '',
        productName: '',
        productspec: '',
        productCompany: '',
        productclassifi: '',
        storageTotalNum: '',
        warehouseName: '',
        storagePeople: '',
        storageTime: '',
        stoRemarks: '',
        applicatNum: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        storageSource: [{ required: true, message: '请选择物资来源', trigger: 'change' }],
        productName: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        storageTotalNum: [{ required: true, message: '请输入入库数量', trigger: 'change' }],
        warehouseName: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        storagePeople: [{ required: true, message: '请输入入库人', trigger: 'change' }],
        storageTime: [{ required: true, message: '请选择入库时间', trigger: 'change' }],
        stoRemarks: [{ required: true, message: '请输入备注', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增入库管理',
      lableWidth: '95px',
      // 临时存储验收
      checkNumNumber: '',
      // 临时存储产品名称
      productName: '',
      // 获取所有产品名称
      productNameData: [],
      // 所有验收单号
      checkNumber: [],
      // 所有仓库名称
      warehouse: [],
      // 申请单号列表
      applicatNums: []
    }
  },
  methods: {
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000, type: 2 })
      } else {
        return '暂无数据'
      }
    },
    productNameChange (val) {
      this.$api.productmanageht.findById({ id: val }).then(res => {
        if (res.code === 200) {
          let { productspec, productCompany, productName } = res.data
          this.ruleForm.productspec = productspec
          this.ruleForm.productCompany = productCompany
          this.ruleForm.productclassifi = res.data.productclassifi
          this.productName = productName
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    applicatNumberChange (val) {
      this.$api.warehousing.findByNums({ nums: val }).then(res => {
        if (res.code === 200) {
          this.ruleForm.productName = res.data[0].productName
          this.ruleForm.productspec = res.data[0].productspec
          this.ruleForm.productCompany = res.data[0].productCompany
          this.ruleForm.productclassifi = res.data[0].productclassifi
          this.productName = res.data[0].productName
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkNumberChange (val) {
      this.$api.checks.findById({ id: val }).then(res => {
        if (res.code === 200) {
          this.ruleForm.productName = res.data.productName
          this.ruleForm.productspec = res.data.productspec
          this.ruleForm.productCompany = res.data.productCompany
          this.ruleForm.productclassifi = res.data.productclassifi
          this.checkNumNumber = res.data.checkNum
          this.productName = res.data.productName
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleQuery (val) {
      this.initdata(val)
    },
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        this.$api.warehousing.deletes({ id: val.id }).then(res => {
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
      val === 'query' ? this.page = 1 : this.page = this.page
      let starttime = ''
      let completetime = ''
      // 初始化数据
      if (this.form.applyTime !== null && 0 in this.form.applyTime) {
        starttime = (this.form.applyTime[0]) / 1000
        completetime = (this.form.applyTime[1]) / 1000
      }
      this.$api.warehousing.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取所有产品名称
      this.$api.warehousing.getProductName().then(res => {
        if (res.code === 200) {
          this.productNameData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取所有仓库名称
      this.$api.warehousing.getWarehouse().then(res => {
        if (res.code === 200) {
          this.warehouse = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取所有验收单号
      this.$api.warehousing.getCheckNum().then(res => {
        if (res.code === 200) {
          this.checkNumber = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取申请单号列表
      this.$api.warehousing.findApplicatNums().then(res => {
        if (res.code === 200) {
          this.applicatNums = res.data
          console.log(this.applicatNums)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogTitle = '新增入库管理'
      this.dialog = true
      this.state = val
      // 获取编号
      this.$api.warehousing.getNum().then(res => {
        if (res.code === 200) {
          this.ruleForm.storageNum = res.data.checknum
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '修改入库管理'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.warehousing.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          // if (this.ruleForm.storageTime === '') {
          //   this.ruleForm.storageTime = ''
          // } else {
          //   this.ruleForm.storageTime = this.ruleForm.storageTime * 1000
          // }
          this.checkNumNumber = res.data.checkNum
          this.productName = res.data.productName
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
          let { applicatNum, id, storageSource, storageNum, checkNum, productName, productspec, productCompany, productclassifi, storageTotalNum, warehouseName, storagePeople, stoRemarks } = this.ruleForm
          // storageTime = storageTime / 1000
          checkNum = this.checkNumNumber
          productName = this.productName
          // 新增
          if (this.state === '1') {
            let obj = { applicatNum, storageSource, storageNum, checkNum, productName, productspec, productCompany, productclassifi, storageTotalNum, warehouseName, stoRemarks }
            this.$api.warehousing.save(obj).then(res => {
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
            let obj = { applicatNum, id, storageSource, storageNum, checkNum, productName, productspec, productCompany, productclassifi, storageTotalNum, warehouseName, storagePeople, stoRemarks }
            this.$api.warehousing.update(obj).then(res => {
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
  computed: {
    storageSourceDisabled () {
      if (this.ruleForm.storageSource === '订单采购') {
        return false
      } else {
        return true
      }
    },
    storageSource () {
      return this.ruleForm.storageSource
    }
  },
  watch: {
    dialog (a, b) {
      if (!a) {
        this.resetForm()
      }
    },
    storageSource (a, b) {
      this.resetForm()
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
