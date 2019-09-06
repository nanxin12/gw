<template>
  <div class="arrearageBox">
    <el-form :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item label="用户编号:">
        <el-input v-model="form.userCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initdata('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">重置内容</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" border stripe class="tables" :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="realName" label="用户姓名" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column label="阀门状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'OPEN'">开启</span>
              <span v-if="scope.row.status === 'CLOSE'">关闭</span>
            </template>
          </el-table-column>
          <el-table-column prop="useNumber" label="用水人数" align="center"></el-table-column>
          <el-table-column prop="detailedAddress" label="所属区域" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <el-table-column label="欠费金额(元)" align="center">
            <template slot-scope="scope">
              <span>{{Number(scope.row.balance) | money}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain v-has="{type: 'message'}" type="primary" style="margin: 5px" round size="mini" @click="noteToll(scope.row)">短信催收</el-button>
              <el-button plain v-has="{type: 'stop'}" type="danger" style="margin: 5px" round size="mini" @click="closeValve(scope.row)">停止供水</el-button>
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
export default {
  name: 'Arrearage',
  data () {
    return {
      waterids: [],
      userids: [],
      form: {
        eltotalCount: 0,
        page: 1,
        size: 10,
        userCode: null
      },
      tableData: []
    }
  },
  created () {
    this.initdata()
  },
  methods: {
    // 短信催收
    noteToll ({ realName, phone, balance }) {
      this.$confirm('此操作将给欠费用户发送短信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.sso.sendMessageArrearage({
          money: Math.abs(balance),
          phone,
          userName: realName
        })
        if (res.code === 200) this.$message.success('短信发送成功')
        else this.$message.error('短信发送失败')
      }).catch(() => false)
    },
    // 关闭阀门
    closeValve (meterCode) {
      this.$confirm('此操作将关闭用户阀门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.sso.closeValve({ meterCode })
        if (res.data.code === '200') {
          this.$message.success(res.data.msg)
          this.initdata()
        } else this.$message.error('关阀失败')
      }).catch(() => false)
    },
    // 表格头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    // 初始化数据
    async initdata (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getArrearageUser(this.form)
      console.log(res)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('欠费信息获取失败')
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.userCode = null
      this.initdata()
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.form.size = values
      this.initdata()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.form.page = values
      this.initdata()
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
