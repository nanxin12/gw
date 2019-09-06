<template>
  <div>
    <el-form :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item label="开始日期:">
        <el-date-picker type="date" placeholder="选择开始日期" style="width: 202px" v-model="form.startTime"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间:">
        <el-date-picker type="date" placeholder="选择截止日期" style="width: 202px" v-model="form.endTime"
                        value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="用户编号:">
        <el-input v-model="form.userCode" placeholder="请输入用户编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">重置内容</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" class="tables" stripe border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="realName" label="用户姓名" align="center"></el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
          <el-table-column label="充值金额(元)" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.payMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column :formatter='formatter' label="缴费时间" align="center"></el-table-column>
          <el-table-column prop="payOrder" label="交易单号" align="center"></el-table-column>
          <el-table-column prop="date" label="交易渠道" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payWay === 'TERMINALPAY'">终端机缴费</span>
              <span v-if="scope.row.payWay === 'BUSINESSPAY'">营业厅</span>
              <span v-if="scope.row.payWay === 'APPPAY'">app</span>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payType === 'ALIPAY'">支付宝</span>
              <span v-if="scope.row.payType === 'WXCHAT'">微信</span>
              <span v-if="scope.row.payType === 'CASH'">现金</span>
            </template>
          </el-table-column>
          <el-table-column label="余额(元)" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.balance | money}}</span>
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
  name: 'Detail',
  data () {
    return {
      form: {
        eltotalCount: 0,
        page: 1,
        size: 10,
        endTime: null,
        meterCode: null,
        startTime: null,
        userCode: null
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
      if (row.paySucTime) return setTime({ date: row.paySucTime, number: 1000 })
      else return '暂无数据'
    },
    // 改变表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getPayDetail(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('缴费信息获取失败')
    },
    // 重置查询条件
    reset () {
      this.form.page = 1
      this.form.endTime = null
      this.form.meterCode = null
      this.form.startTime = null
      this.form.userCode = null
      this.initData()
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
