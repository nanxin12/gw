<template>
  <!-- 采购审批 -->
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
            @click="handleQuery('query' )">搜索</el-button>
          <el-button type="primary"
            v-has="{type: 'approval'}"
            @click="handleBatch('通过')">批量通过</el-button>
          <el-button type="danger"
            v-has="{type: 'reject'}"
            @click="handleBatch('驳回')">批量驳回</el-button>
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
            align="center">
            <template slot-scope="scope">
              <div>
                <el-button size="mini"
                  disabled
                  type="success"
                  v-if="scope.row.proState === '已审批'">已审批</el-button>
                <el-button size="mini"
                  disabled
                  type="danger"
                  v-if="scope.row.proState === '已驳回'">已驳回</el-button>
                <el-button size="mini"
                  disabled
                  type="primary"
                  v-if="scope.row.proState === '待审批'">待审批</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作"
            min-width="130px"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain round size="mini"
                v-has="{type: 'approval'}"
                @click="handleUp(scope.row, '通过')"
                :disabled='scope.row.proState === "已审批"'>审批</el-button>
              <el-button type="danger" plain round size="mini"
                v-has="{type: 'reject'}"
                @click="handleUp(scope.row, '驳回')"
                :disabled='scope.row.proState === "已驳回"'>驳回</el-button>
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
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'ApplyApproval',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      form: {
        applyTime: [],
        productName: ''
      },
      dialog: false,
      // 保存批量选择数据
      selectionChangeData: []
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
    handleSelectionChange (val) {
      this.selectionChangeData = val
    },
    handleBatch (val) {
      if (0 in this.selectionChangeData) {
        this.handleUp(this.selectionChangeData, val)
      } else {
        this.$message.error('请选中数据')
      }
    },
    // 提交状态
    handleUp (row, val) {
      let type = ''
      let proStates = ''
      let success = () => {
        type = 'success'
        proStates = '已审批'
      }
      let error = () => {
        type = 'error'
        proStates = '已驳回'
      }
      val === '通过' ? success() : error()
      this.$confirm(`此操作将${val}该笔采购, 是否继续？`, { type: type }).then(_ => {
        // 接口
        let api = (obj) => {
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
        // 单个
        let objDelete = () => {
          let { buyCount, id, price, proApplicant, proPlanTime, proRemarks, proState, procurementNum, productCompany, productName, productclassifi, productspec, totalPrice, applayPerson } = row
          proState = proStates
          let obj = { buyCount, id, price, proApplicant, proPlanTime, proRemarks, proState, procurementNum, productCompany, productName, productclassifi, productspec, totalPrice, applayPerson }
          api(obj)
        }
        // 批量循环
        let arrDelete = () => {
          row.forEach(v => {
            v.proState = proStates
            api(v)
          })
        }
        // 单个删除数据为obj没有length，批量删除数据为arr有length
        row.length === undefined ? objDelete() : arrDelete()
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
      this.$api.applyApproval.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
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
    // 表头样式改变
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
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
    }
  },
  mounted () {
    this.initdata()
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
