<template>
  <!-- 物资申请 -->
  <div>
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="流水号"
          label-width="70px">
          <el-input v-model="form.singleCode"
            style="width:150px;"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="状态"
          label-width="50px">
          <el-select v-model="form.status"
            style="width:150px;"
            clearable
            placeholder="请选择">
            <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-search"
            @click="initData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 中间内容 -->
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          height="585"
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
            align="center"></el-table-column>
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
  name: '',
  data () {
    return {
      form: {
        singleCode: '',
        status: ''
      },
      total: 0,
      limit: 10,
      page: 1,
      tableData: [],
      options: [
        {
          value: '已审批',
          label: '已审批'
        },
        {
          value: '已驳回',
          label: '已驳回'
        },
        {
          value: '待审批',
          label: '待审批'
        },
        {
          value: '未提交',
          label: '未提交'
        },
        {
          value: '已出库',
          label: '已出库'
        }
      ]
    }
  },
  methods: {
    // 表头样式改变
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    initData () {
      this.$api.personalCenter.getMessageBySingleAndStatusList({ pageNum: this.page, pageSize: this.limit, singleCode: this.form.singleCode, source: '0', status: this.form.status }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 改变每页显示条数
    handleSizeChange (val) {
      this.limit = val
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (val) {
      this.page = val
      this.initData()
    },
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000, type: 2 })
      } else {
        return '暂无数据'
      }
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-top: 16px;
  padding-left: 36px;
  // height: 62px;
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
      // max-height: 585px;
      // overflow: auto;
    }
  }
}
.header /deep/ .el-form-item {
  margin-bottom: 6px;
}
</style>
