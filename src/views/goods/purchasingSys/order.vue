<template>
  <!-- 采购订单管理 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="下单时间"
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
          <el-table-column prop="procurementNum"
            label="流水号"
            align="center"></el-table-column>
          <el-table-column prop="productName"
            label="产品名称"
            align="center"></el-table-column>
          <el-table-column prop="productclassifi"
            label="产品类型"
            align="center"></el-table-column>
          <el-table-column prop="productspec"
            label="产品规格"
            align="center"></el-table-column>
          <el-table-column prop="productCompany"
            label="单位"
            align="center"></el-table-column>
          <el-table-column prop="proActualCount"
            label="实购数量"
            align="center"></el-table-column>
          <el-table-column prop="proActualPrice"
            label="实际单价"
            align="center"></el-table-column>
          <el-table-column prop="proTotalPrice"
            label="实际总价"
            align="center"></el-table-column>
          <el-table-column prop="proName"
            label="采购人"
            align="center"></el-table-column>
          <el-table-column prop="orderTime"
            :formatter="formatter"
            label="下单时间"
            align="center"></el-table-column>
          <el-table-column prop="supplierName"
            label="供应商"
            align="center"></el-table-column>
          <el-table-column prop="orderNumber"
            label="订单号"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="130px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'perfect'}"
                :disabled="scope.row.proState === '已采购'"
                @click="handleRevise(scope.row, '2')">完善订单</el-button>
              <el-button type="success"
                plain
                round
                size="mini"
                v-has="{type: 'submit'}"
                :disabled="scope.row.proState === '已采购'"
                @click="handleUp(scope.row)">提交</el-button>
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
            <el-form-item label="流水号"
              :label-width='lableWidth'>
              <el-input v-model="ruleForm.procurementNum"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="产品类型"
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
            <el-form-item label="实购数量"
              :label-width='lableWidth'
              prop="proActualCount">
              <el-input v-model.number="ruleForm.proActualCount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="实际单价"
              :label-width='lableWidth'
              prop="proActualPrice">
              <el-input v-model.number="ruleForm.proActualPrice"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="实际总金额"
              :label-width='lableWidth'
              prop="proTotalPrice">
              <el-input v-model.number="ruleForm.proTotalPrice"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <!-- <el-col :span='11'>
            <el-form-item label="下单时间"
              :label-width='lableWidth'
              prop="orderTime">
              <el-date-picker v-model="ruleForm.orderTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span='11'>
            <el-form-item label="订单号"
              :label-width='lableWidth'
              prop="orderNumber">
              <el-input v-model="ruleForm.orderNumber"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <!-- <el-col :span='11'>
            <el-form-item label="下单人"
              :label-width='lableWidth'
              prop="proName">
              <el-input v-model="ruleForm.proName"
                disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span='11'>
            <el-form-item label="订单号"
              :label-width='lableWidth'
              prop="orderNumber">
              <el-input v-model="ruleForm.orderNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="供应商"
              :label-width='lableWidth'
              prop="supplierName">
              <el-select v-model="ruleForm.supplierName"
                placeholder="请选择">
                <el-option v-for="item in productSupplier "
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.supplierName">
                </el-option>
              </el-select>
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
  name: 'order',
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
        procurementNum: '',
        productclassifi: '',
        productName: '',
        productspec: '',
        productCompany: '',
        proActualCount: '',
        proActualPrice: '',
        proTotalPrice: '',
        orderTime: '',
        orderNumber: '',
        proName: '',
        supplierName: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        productclassifi: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        productName: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        proActualCount: [{ required: true, validator: buyCountRules, trigger: 'change' }],
        proActualPrice: [{ required: true, validator: priceRules, trigger: 'change' }],
        orderTime: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        orderNumber: [{ required: true, message: '请输入订单号', trigger: 'change' }],
        supplierName: [{ required: true, message: '请选择供应商', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '完善采购订单',
      lableWidth: '95px',
      // 供应商
      productSupplier: []
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
    handleQuery (val) {
      this.initdata(val)
    },
    // 提交状态
    handleUp (val) {
      if (val.proActualCount && val.proActualPrice) {
        let { proPlanTime, buyCount, id, orderNumber, price, proActualCount, proActualPrice, proApplicant, proRemarks, proState, proTotalPrice, procurementNum, productCompany, productName, productclassifi, productspec, supplierName, totalPrice } = val
        proState = '已采购'
        let obj = { proPlanTime, buyCount, id, orderNumber, price, proActualCount, proActualPrice, proApplicant, proRemarks, proState, proTotalPrice, procurementNum, productCompany, productName, productclassifi, productspec, supplierName, totalPrice }
        this.$api.plan.update(obj).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialog = false
            this.initdata()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.error('请完善订单')
      }
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
      this.$api.order.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取供应商
      this.$api.productmanageht.getproductData().then(res => {
        if (res.code === 200) {
          this.productSupplier = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '完善采购订单'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.plan.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = Object.assign(this.ruleForm, res.data)
          console.log(res.data)
          // if (this.ruleForm.orderTime === '') {
          //   this.ruleForm.orderTime = ''
          // } else {
          //   this.ruleForm.orderTime = this.ruleForm.orderTime * 1000
          // }
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
          let { proPlanTime, buyCount, id, orderNumber, price, proActualCount, proActualPrice, proApplicant, proRemarks, proState, proTotalPrice, procurementNum, productCompany, productName, productclassifi, productspec, supplierName, totalPrice } = this.ruleForm
          // orderTime = orderTime / 1000
          let obj = { proPlanTime, buyCount, id, orderNumber, price, proActualCount, proActualPrice, proApplicant, proRemarks, proState, proTotalPrice, procurementNum, productCompany, productName, productclassifi, productspec, supplierName, totalPrice }
          this.$api.plan.update(obj).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.dialog = false
              this.initdata()
            } else {
              this.$message.error(res.msg)
            }
          })
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
    },
    listenPrice () {
      return this.ruleForm.proActualPrice
    },
    listenBuyCount () {
      return this.ruleForm.proActualCount
    }
  },
  watch: {
    dialog (a, b) {
      if (!a) {
        this.resetForm()
      }
    },
    listenPrice (a, b) {
      if (this.ruleForm.proActualCount !== '' && this.ruleForm.proActualCount !== null) {
        this.ruleForm.proTotalPrice = Number((this.ruleForm.proActualCount * a).toFixed(2))
      }
    },
    listenBuyCount (a, b) {
      if (this.ruleForm.proActualPrice !== '' && this.ruleForm.proActualPrice !== null) {
        this.ruleForm.proTotalPrice = Number((this.ruleForm.proActualPrice * a).toFixed(2))
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
