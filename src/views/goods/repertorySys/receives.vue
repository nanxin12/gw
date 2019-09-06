<template>
  <!-- 物资申请 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="申请时间"
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
          <el-table-column prop="applicatNum"
            label="申请单号"
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
          <el-table-column prop="applicatToalNum"
            label="申请数量"
            align="center"></el-table-column>
          <el-table-column prop="applicatPurpose"
            label="申请用途"
            align="center"></el-table-column>
          <el-table-column prop="applicatPeople"
            label="申请人"
            align="center"></el-table-column>
          <el-table-column prop="applicatTime"
            :formatter='formatter'
            label="申请时间"
            align="center"></el-table-column>
          <el-table-column prop="applicatState"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                disabled
                type="success"
                v-if="scope.row.applicatState === '已审批'">已审批</el-button>
              <el-button size="mini"
                disabled
                type="danger"
                v-if="scope.row.applicatState === '已驳回'">已驳回</el-button>
              <el-button size="mini"
                disabled
                type="primary"
                v-if="scope.row.applicatState === '待审批'">待审批</el-button>
              <el-button size="mini"
                disabled
                v-if="scope.row.applicatState === '未提交'">未提交</el-button>
              <el-button size="mini"
                type="info"
                disabled
                v-if="scope.row.applicatState === '已出库'">已出库</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="applicatRemarks"
            label="备注"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="140px"
            align="center">
            <template slot-scope="scope">
              <el-button type="success"
                plain
                round
                size="mini"
                v-has="{type: 'submit'}"
                :disabled="scope.row.applicatState !== '未提交'"
                @click="handleUp(scope.row)"
              >提交</el-button>
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'update'}"
                :disabled="scope.row.applicatState !== '未提交'"
                @click="handleRevise(scope.row, '2')">修改</el-button>
              <el-button type="danger"
                plain
                round
                size="mini"
                v-has="{type: 'delete'}"
                :disabled="scope.row.applicatState !== '未提交'"
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
              <el-form-item label="申请单号"
                :label-width='lableWidth'>
                <el-input v-model="ruleForm.applicatNum"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="产品名称"
                :label-width='lableWidth'
                prop="productName">
                <el-select v-model="ruleForm.productName"
                  @change="productNameChange"
                  placeholder="请选择">
                  <el-option v-for="item in productNameData "
                    :key="item.id"
                    :label="item.productName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="产品规格"
                :label-width='lableWidth'
                prop="productspec">
                <el-input v-model="ruleForm.productspec"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="单位"
                :label-width='lableWidth'
                prop="productCompany">
                <el-input v-model="ruleForm.productCompany"
                  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="产品分类"
                :label-width='lableWidth'
                prop="productclassifi">
                <el-input v-model="ruleForm.productclassifi"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="申请数量"
                :label-width='lableWidth'
                prop="applicatToalNum">
                <el-input v-model.number="ruleForm.applicatToalNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="申请用途"
                :label-width='lableWidth'
                prop="applicatPurpose">
                <el-input v-model="ruleForm.applicatPurpose"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span='11'>
              <el-form-item label="申请人"
                :label-width='lableWidth'
                prop="applicatPeople">
                <el-input v-model="ruleForm.applicatPeople"></el-input>
              </el-form-item>
            </el-col> -->
            <!-- <el-col :span='11'>
              <el-form-item label="申请时间"
                :label-width='lableWidth'
                prop="applicatTime">
                <el-date-picker v-model="ruleForm.applicatTime"
                  value-format="timestamp"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="备注"
                :label-width='lableWidth'
                prop="applicatRemarks">
                <el-input v-model="ruleForm.applicatRemarks"
                  type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <span style="color: red;cursor: pointer;"
                @click="manualInput">下拉没有想要的产品请点击手动输入产品</span>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-if="this.state === '3'">
        <el-form :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="left">
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="申请单号"
                :label-width='lableWidth'>
                <el-input v-model="ruleForm.applicatNum"
                  disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="产品名称"
                :label-width='lableWidth'
                prop="productName">
                <el-input v-model="ruleForm.productName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="产品规格"
                :label-width='lableWidth'
                prop="productspec">
                <el-input v-model="ruleForm.productspec"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="单位"
                :label-width='lableWidth'
                prop="productCompany">
                <el-input v-model="ruleForm.productCompany"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="产品分类"
                :label-width='lableWidth'
                prop="productclassifi">
                <el-input v-model="ruleForm.productclassifi"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='11'>
              <el-form-item label="申请数量"
                :label-width='lableWidth'
                prop="applicatToalNum">
                <el-input v-model.number="ruleForm.applicatToalNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='11'>
              <el-form-item label="申请用途"
                :label-width='lableWidth'
                prop="applicatPurpose">
                <el-input v-model="ruleForm.applicatPurpose"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span='11'>
              <el-form-item label="申请时间"
                :label-width='lableWidth'
                prop="applicatTime">
                <el-date-picker v-model="ruleForm.applicatTime"
                  value-format="timestamp"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row type="flex"
            justify="space-between">
            <el-col :span='24'>
              <el-form-item label="备注"
                :label-width='lableWidth'
                prop="applicatRemarks">
                <el-input v-model="ruleForm.applicatRemarks"
                  type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
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
  name: 'receives',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        applicatNum: '',
        productName: '',
        productspec: '',
        productCompany: '',
        productclassifi: '',
        applicatToalNum: '',
        applicatPurpose: '',
        applicatPeople: '',
        applicatTime: '',
        applicatRemarks: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        storageSource: [{ required: true, message: '请选择物资来源', trigger: 'change' }],
        productName: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        applicatToalNum: [{ required: true, message: '请输入申请数量', trigger: 'change' }],
        applicatPurpose: [{ required: true, message: '请输入申请用途', trigger: 'change' }],
        applicatPeople: [{ required: true, message: '请输入申请人', trigger: 'change' }],
        applicatTime: [{ required: true, message: '请选择申请时间', trigger: 'change' }],
        applicatRemarks: [{ required: true, message: '请输入备注', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增物资申请',
      lableWidth: '95px',
      // 临时存储产品名称
      productName: '',
      // 获取所有产品名称
      productNameData: [],
      userInfo: {}
    }
  },
  methods: {
    manualInput () {
      // this.dialog = true
      this.resetForm()
      this.state = '3'
    },
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
    handleQuery (val) {
      this.initdata(val)
    },
    // 提交状态
    handleUp (val) {
      let { applicatTime, id, applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicaPerson } = val
      let applicatState = '待审批'
      let obj = { applicatTime, id, applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicatState, applicaPerson }
      this.$api.receives.Submis(obj).then(res => {
        if (res.code === 200) {
          res.data === undefined ? this.$message.success(res.msg) : this.$message.success(res.data.msg)
          this.dialog = false
          this.initdata()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 删除
    handleDelete (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        this.$api.receives.deletes({ id: val.id }).then(res => {
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
      this.$api.receives.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
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
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogTitle = '新增物资申请'
      this.dialog = true
      this.state = val
      // 获取编号
      this.$api.receives.getNum().then(res => {
        if (res.code === 200) {
          this.ruleForm.applicatNum = res.data.applicatnum
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '修改物资申请'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.receives.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          // if (this.ruleForm.applicatTime === '') {
          //   this.ruleForm.applicatTime = ''
          // } else {
          //   this.ruleForm.applicatTime = this.ruleForm.applicatTime * 1000
          // }
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
          let { id, applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicatState, applicaPerson } = this.ruleForm
          // applicatTime = applicatTime / 1000
          // 新增
          if (this.state === '1') {
            productName = this.productName
            applicatState = '未提交'
            applicatPeople = this.userInfo.name
            applicaPerson = this.userInfo.id
            let obj = { applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicatState, applicaPerson }
            this.$api.receives.save(obj).then(res => {
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
            productName = this.productName
            let obj = { id, applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicatState, applicaPerson }
            this.$api.receives.update(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
          // 手动输入
          if (this.state === '3') {
            applicatState = '未提交'
            let obj = { applicatNum, productName, productspec, productCompany, productclassifi, applicatToalNum, applicatPurpose, applicatPeople, applicatRemarks, applicatState, applicaPerson }
            this.$api.receives.manualSave(obj).then(res => {
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
    this.userInfo = JSON.parse(localStorage.getItem('userMsg'))
    this.initdata()
    let a = this.$route.query.shopId
    if (a) {
      this.dialogTitle = '新增物资申请'
      this.dialog = true
      this.state = '1'
      this.ruleForm.applicatNum = a
    }
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

// .inner /deep/ .el-dialog__body {
//   padding: 25px 60px 10px !important;
// }
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
