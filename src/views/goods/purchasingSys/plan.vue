<template>
  <!-- 采购计划管理 -->
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
          <el-button type="danger"
            v-has="{type: 'delete'}"
            @click="handleDeletes">批量删除</el-button>
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
          @selection-change="handleSelectionChange"
          :header-cell-style="tableHeaderColor">
          <el-table-column type="selection"
            width="55">
          </el-table-column>
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
          <el-table-column prop="buyCount"
            label="购买数量"
            align="center"></el-table-column>
          <el-table-column prop="price"
            label="预估单价"
            align="center"></el-table-column>
          <el-table-column prop="totalPrice"
            label="预估总价"
            align="center"></el-table-column>
          <el-table-column prop="proApplicant"
            label="申请人"
            align="center"></el-table-column>
          <el-table-column prop="proPlanTime"
            :formatter="formatter"
            label="申请时间"
            align="center"></el-table-column>
          <el-table-column prop="proRemarks"
            label="备注"
            align="center"></el-table-column>
          <el-table-column prop="proState"
            label="状态"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="160px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'submit'}"
                v-if="scope.row.proState === '未提交'"
                @click="handleUp(scope.row)">提交</el-button>
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'update'}"
                :disabled="scope.row.proState !== '未提交'"
                @click="handleRevise(scope.row, '2')">修改</el-button>
              <el-button type="danger"
                plain
                round
                size="mini"
                v-has="{type: 'delete'}"
                :disabled="scope.row.proState !== '未提交'"
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
              <el-select v-model="ruleForm.productclassifi"
                @change="productClassChange"
                placeholder="请选择">
                <el-option v-for="item in supplierData "
                  :key="item.id"
                  :label="item.classificName"
                  :value="item.classificName">
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
                :disabled="productNameDisabled"
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
            <el-form-item label="购买数量"
              :label-width='lableWidth'
              prop="buyCount">
              <el-input v-model.number="ruleForm.buyCount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="预估单价"
              :label-width='lableWidth'
              prop="price">
              <el-input v-model="ruleForm.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="预估总价"
              :label-width='lableWidth'
              prop="totalPrice">
              <el-input v-model.number="ruleForm.totalPrice"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='24'>
            <el-form-item label="备注"
              :label-width='lableWidth'
              prop="proRemarks">
              <el-input v-model="ruleForm.proRemarks"
                type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="8"
            style="display:flex;justify-content:flex-end">
            <el-button type="primary"
              @click="handleSumbit('ruleForm')">确 定</el-button>
            <el-button @click="dialog = false">取 消</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'plan',
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
        buyCount: '',
        price: '',
        totalPrice: '',
        proRemarks: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        productclassifi: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        productName: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        buyCount: [{ required: true, validator: buyCountRules, trigger: 'change' }],
        price: [{ required: true, validator: priceRules, trigger: 'change' }],
        proRemarks: [{ required: true, message: '请输入备注', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增采购计划',
      // 保存批量选择数据
      selectionChangeData: [],
      lableWidth: '95px',
      // 供应商分类数据
      supplierData: [],
      productNameData: [],
      productName: '',
      userInfo: {}
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
    productClassChange (val) {
      this.ruleForm.productName = ''
      this.ruleForm.productspec = ''
      this.ruleForm.productCompany = ''
      this.productNameData = []
      this.$api.plan.findByClassGetName({ productclassifi: val }).then(res => {
        if (res.code === 200) {
          this.productNameData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    productNameChange (val) {
      this.$api.productmanageht.findById({ id: val }).then(res => {
        if (res.code === 200) {
          let { productspec, productCompany, productName } = res.data
          this.ruleForm.productspec = productspec
          this.ruleForm.productCompany = productCompany
          this.productName = productName
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleQuery (val) {
      this.initdata(val)
    },
    handleSelectionChange (val) {
      this.selectionChangeData = val
    },
    // 提交状态
    handleUp (val) {
      let { buyCount, id, price, proApplicant, proPlanTime, proRemarks, proState, procurementNum, productCompany, productName, productclassifi, productspec, totalPrice, applayPerson } = val
      proState = '待审批'
      let obj = { buyCount, id, price, proApplicant, proPlanTime, proRemarks, proState, procurementNum, productCompany, productName, productclassifi, productspec, totalPrice, applayPerson }
      this.$api.plan.update(obj).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialog = false
          this.initdata()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 删除
    handleDelete (val) {
      this.deleteApi(val)
    },
    // 删除接口内置判断
    deleteApi (val) {
      this.$confirm('确认删除？', { type: 'error' }).then(_ => {
        // 删除的接口
        let api = (val) => {
          this.$api.plan.deletes({ id: val }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.initdata()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
        // 单个删除
        let objDelete = () => {
          api(val.id)
        }
        // 批量循环删除
        let arrDelete = () => {
          val.forEach(v => {
            if (v.proState === '未提交') {
              api(v.id)
            } else {
              this.$message.error('该条数据已提交无法删除')
            }
          })
        }
        // 单个删除数据为obj没有length，批量删除数据为arr有length
        val.length === undefined ? objDelete() : arrDelete()
      }).catch(() => {
        this.$message.error('已取消')
      })
    },
    // 批量删除
    handleDeletes () {
      if (0 in this.selectionChangeData) {
        this.deleteApi(this.selectionChangeData)
      } else {
        this.$message.error('请选中数据')
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
      this.$api.plan.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取供应商分类
      this.$api.supplierht.getSupplierData().then(res => {
        if (res.code === 200) {
          this.supplierData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加按钮
    handleAdd (val) {
      this.dialogTitle = '新增采购计划'
      this.dialog = true
      this.state = val
      // 获取编号
      this.$api.plan.getNum().then(res => {
        if (res.code === 200) {
          this.ruleForm.procurementNum = res.data.procurementnum
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val, state) {
      this.dialogTitle = '修改采购计划'
      this.dialog = true
      this.state = state
      // 根据id查数据
      this.$api.plan.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          this.productName = res.data.productName
          this.$api.plan.findByClassGetName({ productclassifi: res.data.productclassifi }).then(ress => {
            if (res.code === 200) {
              this.productNameData = ress.data
            } else {
              this.$message.error(res.msg)
            }
          })
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
          let { procurementNum, productclassifi, productName, productspec, productCompany, buyCount, price, totalPrice, proRemarks, id, proApplicant, proPlanTime, proState, applayPerson } = this.ruleForm
          price = Number(price)
          // 新增
          if (this.state === '1') {
            proPlanTime = Math.round(new Date().getTime() / 1000)
            proState = '未提交'
            proApplicant = this.userInfo.name
            applayPerson = this.userInfo.id
            productName = this.productName
            let obj = { procurementNum, proPlanTime, productclassifi, productName, productspec, productCompany, buyCount, price, totalPrice, proRemarks, proState, proApplicant, applayPerson }
            this.$api.plan.save(obj).then(res => {
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
            let obj = { buyCount, id, price, proApplicant, proPlanTime, proRemarks, proState, procurementNum, productCompany, productName, productclassifi, productspec, totalPrice, applayPerson }
            this.$api.plan.update(obj).then(res => {
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
      return this.ruleForm.price
    },
    listenBuyCount () {
      return this.ruleForm.buyCount
    }
  },
  watch: {
    dialog (a, b) {
      if (!a) {
        this.resetForm()
      }
    },
    listenPrice (a, b) {
      if (this.ruleForm.buyCount !== '' && this.ruleForm.buyCount !== null) {
        this.ruleForm.totalPrice = Number((this.ruleForm.buyCount * a).toFixed(2))
      }
    },
    listenBuyCount (a, b) {
      if (this.ruleForm.price !== '' && this.ruleForm.price !== null) {
        this.ruleForm.totalPrice = Number((this.ruleForm.price * a).toFixed(2))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 62px;
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
}
.inner /deep/ .el-dialog__footer {
  padding: 10px 60px 40px !important;
}
</style>
