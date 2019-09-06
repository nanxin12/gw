<template>
  <!-- 物资出库 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="出库时间"
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
          <el-table-column prop="warehouseName"
            label="所属仓库"
            align="center"></el-table-column>
          <el-table-column prop="outPeople"
            label="出库人"
            align="center"></el-table-column>
          <el-table-column prop="outTime"
            :formatter='formatter'
            label="出库时间"
            align="center"></el-table-column>
          <el-table-column prop="applicatState"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                disabled
                type="primary"
                v-if="scope.row.applicatState === '已审批'">待出库</el-button>
              <el-button size="mini"
                disabled
                type="success"
                v-if="scope.row.applicatState === '已出库'">已出库</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="applicatRemarks"
            label="备注"
            align="center"></el-table-column>
          <el-table-column label="操作"
            min-width="150px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                plain
                round
                size="mini"
                v-has="{type: 'update'}"
                :disabled="scope.row.applicatState === '已出库'"
                @click="handleRevise(scope.row)">修改</el-button>
              <el-button type="success"
                plain
                round
                size="mini"
                v-has="{type: 'outStock'}"
                :disabled="scope.row.applicatState === '已出库'"
                @click="handleUp(scope.row)">确认出库</el-button>
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
            <el-form-item label="所属仓库"
              :label-width='lableWidth'
              prop="warehouseName">
              <el-select v-model="ruleForm.warehouseName"
                clearable
                placeholder="请选择">
                <el-option v-for="item in whouseName "
                  :key="item.id"
                  :label="item.whouseName"
                  :value="item.whouseName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span='11'>
            <el-form-item label="出库人"
              :label-width='lableWidth'
              prop="outPeople">
              <el-input v-model="ruleForm.outPeople"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="申请时间"
              :label-width='lableWidth'
              prop="applicatTime">
              <el-date-picker v-model="ruleForm.applicatTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
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
  name: 'receives',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        warehouseName: '',
        outPeople: ''
      },
      form: {
        applyTime: [],
        productName: ''
      },
      rules: {
        warehouseName: [{ required: true, message: '请选择所属仓库', trigger: 'change' }],
        outPeople: [{ required: true, message: '请输入出库人', trigger: 'change' }]
      },
      dialog: false,
      // 判断状态 添加1 修改2 删除3
      state: '',
      // 弹窗名字
      dialogTitle: '新增物资申请',
      lableWidth: '95px',
      // 临时存储产品名称
      productName: '',
      // 所有仓库
      whouseName: []
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
      if (val.warehouseName) {
        let { applicatNum, applicatPeople, applicatPurpose, applicatRemarks, applicatState, applicatTime, applicatToalNum, id, outPeople, productCompany, productName, productclassifi, productspec, warehouseName, outTime, applicatApprovalTime } = val
        applicatState = '已出库'
        let obj = { applicatNum, applicatPeople, applicatPurpose, applicatRemarks, applicatState, applicatTime, applicatToalNum, id, outPeople, productCompany, productName, productclassifi, productspec, warehouseName, outTime, applicatApprovalTime }
        this.$api.deliverys.outSure(obj).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.dialog = false
            this.initdata()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.error('请填选所属仓库')
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
      this.$api.deliverys.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取所有仓库
      this.$api.warehousing.getWarehouse().then(res => {
        if (res.code === 200) {
          this.whouseName = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val) {
      this.dialogTitle = '修改物资申请'
      this.dialog = true
      // 根据id查数据
      this.$api.receives.findById({ id: val.id }).then(res => {
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
          let { applicatNum, applicatPeople, applicatPurpose, applicatRemarks, applicatState, applicatTime, applicatToalNum, id, outPeople, productCompany, productName, productclassifi, productspec, warehouseName, outTime, applicatApprovalTime } = this.ruleForm
          outTime = Math.round(new Date().getTime() / 1000)
          // 修改
          let obj = { applicatNum, applicatPeople, applicatPurpose, applicatRemarks, applicatState, applicatTime, applicatToalNum, id, outPeople, productCompany, productName, productclassifi, productspec, warehouseName, outTime, applicatApprovalTime }
          this.$api.receives.update(obj).then(res => {
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
