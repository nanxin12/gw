<template>
    <div>
      <el-form :inline="true" :model="form" label-width="100px" label-position="right">
        <el-form-item label="用户编号:">
          <el-input v-model="form.userCode" placeholder="请输入用户编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData('query')">立即查询</el-button>
          <el-button type="primary" @click="reset">内容重置</el-button>
        </el-form-item>
      </el-form>
      <div class="box">
        <div class="boxContent">
          <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
            <el-table-column label="序号" align="center" width="60">
              <template slot-scope="scope">
                <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
            <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
            <el-table-column :formatter='formatter' label="所属日期" align="center"></el-table-column>
            <el-table-column prop="abnormalWaterYield" label="水表异常用水量(吨)" align="center"></el-table-column>
            <el-table-column prop="waterYield" label="水表累积量(吨)" align="center"></el-table-column>
            <el-table-column prop="waterYieldAvg" label="水表平均值(吨)" align="center"></el-table-column>
          </el-table>
                  <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.eltotalCount">
        </el-pagination>
        </div>
      </div>
    </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'abnormalWater',
  data () {
    return {
      form: {
        page: 1,
        size: 10,
        eltotalCount: 0,
        userCode: null
      },
      tableData: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getfAbnormalUserList(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
    },
    // 表格转时间
    formatter (row) {
      if (row.time) return setTime({ date: row.time, number: 1000 })
      else return '暂无数据'
    },
    reset () {
      this.form.page = 1
      this.form.userCode = null
      this.initData()
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.form.size = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.form.page = values
      this.initData()
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
      .tables{
        margin-bottom: 20px;
      }
    }
  }
</style>
