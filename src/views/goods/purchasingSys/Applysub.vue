<template>
  <!-- 待采购 -->
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
                  type="primary">待采购</el-button>
                <div>{{scope.a}}</div>
              </div>
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
      dialog: false
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
    initdata (val) {
      val === 'query' ? this.page = 1 : this.page = this.page
      let starttime = ''
      let completetime = ''
      // 初始化数据
      if (this.form.applyTime !== null && 0 in this.form.applyTime) {
        starttime = (this.form.applyTime[0]) / 1000
        completetime = (this.form.applyTime[1]) / 1000
      }
      this.$api.applysub.getList({ pageNum: this.page, pageSize: this.limit, starttime, completetime, productName: this.form.productName }).then(res => {
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
