<template>
  <div class="meterBox">
    <el-form :inline="true" :model="form" label-width="200px" label-position="right">
      <el-form-item label="水表编号/用户编号:">
        <el-input v-model="form.condition" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">重置内容</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" stripe class="tables" border
                  :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column :formatter='formatter' label="抄表时间" align="center"></el-table-column>
          <el-table-column prop="waterMeterTotal" label="水表累计量(吨)" align="center"></el-table-column>
          <el-table-column label="水表阀门状态" align="center">
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
          <el-table-column prop="batteryVol" label="电池电压(v)" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain v-has="{type: 'open'}" type="success" style="margin: 5px" :disabled="scope.row.status === 'OPEN'" round size="mini" @click="openValve(scope.row.meterCode)">开阀</el-button>
              <el-button plain v-has="{type: 'shut'}" type="danger" style="margin: 5px" :disabled="scope.row.status !== 'OPEN'" round size="mini" @click="closeValve(scope.row.meterCode)">关阀</el-button>
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
  name: 'Meter',
  data () {
    return {
      form: {
        eltotalCount: 0,
        size: 10,
        page: 1,
        condition: null
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
    // 开阀
    openValve (meterCode) {
      this.$confirm('此操作将开启用户阀门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.sso.openValve({ meterCode })
        if (res.code === 200) {
          this.$message.success('开阀成功')
          this.initData()
        } else this.$message.error('开阀失败')
      }).catch(() => false)
    },
    // 关阀
    closeValve (meterCode) {
      this.$confirm('此操作将关闭用户阀门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.sso.closeValve({ meterCode })
        if (res.data.code === '200') {
          this.$message.success('关阀成功')
          this.initData()
        } else this.$message.error('关阀失败')
      }).catch(() => false)
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.condition = null
      this.initData()
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getNowData(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('用户信息获取失败')
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
    // 表头样式
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
