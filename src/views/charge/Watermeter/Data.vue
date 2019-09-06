<template>
  <div class="dataBox">
    <el-form :inline="true" :model="form" label-position="right">
      <el-form-item label="水表编号/用户编号:" label-width="165px">
        <el-input v-model="form.condition" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="开始日期:" label-width="100px">
        <el-date-picker type="date" placeholder="选择开始日期" v-model="form.startTime"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间:" label-width="100px">
        <el-date-picker type="date" placeholder="选择截止日期" v-model="form.endTime"
                        value-format="yyyy-MM-dd"></el-date-picker>
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
              <span>{{(form.page-1) * form.size + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column :formatter='formatter' label="抄表时间" align="center"></el-table-column>
          <el-table-column prop="waterMeterTotal" label="水表累计数(吨)" align="center"></el-table-column>
          <el-table-column prop="batteryVol" label="水表电压(v)" align="center"></el-table-column>
          <el-table-column label="是否泄漏" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.reveal === 'NO'">
                <el-tag type="success">未泄漏</el-tag>
              </span>
              <span v-if="scope.row.reveal === 'YES'">
                <el-tag type="danger">已泄露</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="阀门状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'FAULT'">
                <el-tag type="warning">阀门异常</el-tag>
              </span>
              <span v-if="scope.row.status === 'OPEN'">
                <el-tag type="success">开阀</el-tag>
              </span>
              <span v-if="scope.row.status === 'CLOSE'">
                <el-tag type="danger">关阀</el-tag>
              </span>
            </template>
          </el-table-column>
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
  name: 'Data',
  data () {
    return {
      form: {
        startTime: null,
        endTime: null,
        condition: null,
        page: 1,
        size: 10,
        eltotalCount: 0
      },
      tableData: []
    }
  },
  created () {
    this.initData()
  },
  mounted () {

  },
  methods: {
    // 表格转时间
    formatter (row) {
      if (row.readTime) return setTime({ date: row.readTime, number: 1000 })
      else return '暂无数据'
    },
    // 表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    // 重置查询条件
    reset () {
      this.form.condition = null
      this.form.startTime = null
      this.form.endTime = null
      this.form.page = 1
      this.initData()
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getHistroyData(this.form)
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
