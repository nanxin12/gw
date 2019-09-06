<template>
  <!-- 物资验收 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="验收时间"
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
          <el-table-column prop="checkNum"
            label="验收单号"
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
          <el-table-column prop="checkTotalNum"
            label="验收数量"
            align="center"></el-table-column>
          <el-table-column prop="orderNumber"
            label="采购订单号"
            align="center"></el-table-column>
          <el-table-column prop="checkPeople"
            label="验收人"
            align="center"></el-table-column>
          <el-table-column prop="checkTime"
            :formatter='formatter'
            label="验收时间"
            align="center"></el-table-column>
          <el-table-column prop="checkRemarks"
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
            <el-form-item label="验收单号"
              :label-width='lableWidth'>
              <el-input v-model="ruleForm.checkNum"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="采购单号"
              :label-width='lableWidth'
              prop="orderNumber">
              <el-select v-model="ruleForm.orderNumber"
                @change="chaseNumberChange"
                placeholder="请选择">
                <el-option v-for="item in chaseNumber "
                  :key="item.id"
                  :label="item.orderNumber"
                  :value="item.id">
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
              <el-input v-model="ruleForm.productName"
                disabled></el-input>
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
              <el-input v-model.number="ruleForm.productclassifi"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <!-- <el-col :span='11'>
            <el-form-item label="验收人"
              :label-width='lableWidth'
              prop="checkPeople">
              <el-input v-model.number="ruleForm.checkPeople"></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span='11'>
            <el-form-item label="验收数量"
              :label-width='lableWidth'
              prop="checkTotalNum">
              <el-input v-model.number="ruleForm.checkTotalNum"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <!-- <el-col :span='11'>
            <el-form-item label="验收时间"
              :label-width='lableWidth'
              prop="checkTime">
              <el-date-picker v-model="ruleForm.checkTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <el-col :span='11'>
            <el-form-item label="验收数量"
              :label-width='lableWidth'
              prop="checkTotalNum">
              <el-input v-model.number="ruleForm.checkTotalNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="备注"
              :label-width='lableWidth'
              prop="checkRemarks">
              <el-input v-model="ruleForm.checkRemarks"
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
  name: 'checks',
  data () {
    let buyCountRules = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    let priceRules = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (!(/^(0|[1-9][0-9]*)(\.\d+)?$/.test(value))) {
        callback(new Error('请输入正数'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        checkNum: '',
        orderNumber: '',
        productName: '',
        productspec: '',
        productCompany: '',
        checkTotalNum: '',
        checkPeople: '',
        checkTime: '',
        checkRemarks: '',
        productclassifi: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        orderNumber: [{ required: true, message: '请选择采购单号', trigger: 'change' }],
        checkTotalNum: [{ required: true, message: '请输入验收数量', trigger: 'change' }],
        checkPeople: [{ required: true, message: '请输入验收人', trigger: 'change' }],
        checkTime: [{ required: true, message: '请选择验收时间', trigger: 'change' }],
        buyCount: [{ required: true, validator: buyCountRules, trigger: 'change' }],
        price: [{ required: true, validator: priceRules, trigger: 'change' }],
        checkRemarks: [{ required: true, message: '请输入备注', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增物资验收',
      lableWidth: '95px',
      // 所有采购单号
      chaseNumber: [],
      // 临时存储采购单号
      purchaseNumber: ''
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
    chaseNumberChange (val) {
      this.$api.order.findById({ id: val }).then(res => {
        if (res.code === 200) {
          this.ruleForm.productName = res.data.productName
          this.ruleForm.productspec = res.data.productspec
          this.ruleForm.productCompany = res.data.productCompany
          this.$set(this.ruleForm, 'productclassifi', res.data.productclassifi)
          this.purchaseNumber = res.data.orderNumber
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
        this.$api.checks.deletes({ id: val.id }).then(res => {
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
      this.$api.checks.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取
      this.$api.checks.getChaseNum().then(res => {
        if (res.code === 200) {
          this.chaseNumber = res.data.filter(v => v.orderNumber)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogTitle = '新增物资验收'
      this.dialog = true
      this.state = val
      // 获取编号
      this.$api.checks.getNum().then(res => {
        if (res.code === 200) {
          this.ruleForm.checkNum = res.data.checknum
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '修改物资验收'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.checks.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          if (this.ruleForm.checkTime === '') {
            this.ruleForm.checkTime = ''
          } else {
            this.ruleForm.checkTime = this.ruleForm.checkTime * 1000
          }
          this.purchaseNumber = res.data.orderNumber
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
          let { checkNum, checkRemarks, checkTotalNum, id, orderNumber, productCompany, productName, productspec, productclassifi } = this.ruleForm
          // checkTime = checkTime / 1000
          orderNumber = this.purchaseNumber
          // 新增
          if (this.state === '1') {
            let obj = { checkNum, checkRemarks, checkTotalNum, orderNumber, productCompany, productName, productspec, productclassifi }
            this.$api.checks.save(obj).then(res => {
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.dialog = false
                this.initdata()
              } else {
                this.$message.error(res.msg)
              }
            }).catch(res => {
              this.$message.error(res.response.data.msg)
            })
          }
          // 修改
          if (this.state === '2') {
            let obj = { checkNum, checkRemarks, checkTotalNum, id, orderNumber, productCompany, productName, productspec, productclassifi }
            this.$api.checks.update(obj).then(res => {
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
    productNameDisabled () {
      if (this.ruleForm.productclassifi === undefined || this.ruleForm.productclassifi == null || this.ruleForm.productclassifi === '') {
        return true
      } else {
        return false
      }
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
