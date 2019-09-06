<template>
  <div class="readingBox">
    <el-form :inline="true" :model="form" label-position="right" label-width="100px">
      <el-form-item label="用户编号:">
        <el-input v-model="form.userCode"></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-date-picker v-model="form.startTime" value-format="yyyy-MM-dd" style="width: 202px" type="date" placeholder="选择开始日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd" style="width: 202px" type="date" placeholder="选择结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">重置内容</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column prop="meterTotal" label="水表累积量(吨)" align="center"></el-table-column>
          <el-table-column :formatter='formatter' label="抄表时间" align="center"></el-table-column>
          <el-table-column prop="creator" label="抄表人" align="center"></el-table-column>
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
  name: 'readMeterRecord',
  data () {
    return {
      form: {
        startTime: null,
        endTime: null,
        userCode: null,
        eltotalCount: 0,
        size: 10,
        page: 1
      },
      tableData: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 表格转时间
    formatter (row) {
      if (row.readTime) return setTime({ date: row.readTime, number: 1000 })
      else return '暂无数据'
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.userCode = null
      this.form.startTime = null
      this.form.endTime = null
      this.initData()
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.readHistoryMeter(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('数据获取失败')
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
    },
    // 改变表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
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
