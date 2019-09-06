<template>
  <div class="rechargeBox">
    <el-form :inline="true"
      :model="form"
      label-width="100px"
      label-position="right">
      <el-form-item label="用户编号:">
        <el-input v-model="form.userCode"
          placeholder="请输入用户编号"></el-input>
      </el-form-item>
      <el-form-item label="水表编号:">
        <el-input v-model="form.meterCode"
          placeholder="请输入水表编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="initData('query')">立即查询</el-button>
        <el-button type="primary"
          @click="reset">内容重置</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          border
          :header-cell-style="tableHeaderColor">
          <el-table-column label="序号"
            align="center"
            width="60">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode"
            label="用户编号"
            align="center"></el-table-column>
          <el-table-column prop="userInfo.realName"
            label="用户姓名"
            align="center"></el-table-column>
          <el-table-column prop="meterCode"
            label="水表编号"
            align="center"></el-table-column>
          <el-table-column prop="userInfo.phone"
            label="手机号码"
            align="center"></el-table-column>
          <el-table-column prop="balanceStr"
            label="余额(元)"
            align="center"></el-table-column>
          <el-table-column label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button plain
                v-has="{type: 'recharge'}"
                round
                type="success"
                size="mini"
                @click="recharge(scope.row)">充值</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align="center"
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
    <el-dialog title="水费充值"
      :visible.sync="rechargeDig"
      width="30%"
      @close="digClose">
      <el-form :model="ruleForm"
        :rules="rules"
        ref="refruleForm"
        label-width="90px"
        class="demo-ruleForm">
        <el-form-item label="用户编号">
          <el-input v-model="ruleForm.userCode"
            placeholder="请输入用户编号"
            readonly></el-input>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="ruleForm.username"
            placeholder="请输入用户姓名"
            readonly></el-input>
        </el-form-item>
        <el-form-item label="水表编号">
          <el-input v-model="ruleForm.waterid"
            placeholder="请输入水表编号"
            readonly></el-input>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-radio-group v-model="ruleForm.waterType">
            <el-radio label="1">NB水表</el-radio>
            <el-radio label="2">红外线水表</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="18">
            <el-form-item label="缴费金额"
              prop="money">
              <el-input v-model="ruleForm.money"
                placeholder="请输入缴费金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"
            style="display: flex; justify-content: center">
            <span style="height: 40px;line-height: 40px;">元</span>
          </el-col>
        </el-row>
        <el-form-item label="支付方式">
          <el-select v-model="ruleForm.payType"
            placeholder="请选择支付方式">
            <el-option label="支付宝"
              value="ALIPAY"></el-option>
            <el-option label="微信"
              value="WXCHAT"></el-option>
            <el-option label="现金"
              value="CASH"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="打印凭证">
          <el-radio-group v-model="ruleForm.print">
            <el-radio label="1">打印</el-radio>
            <el-radio label="2">不打印</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="rechargeDig = false">取 消</el-button>
          <el-button type="primary"
            @click="submit('refruleForm')">充值</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div id="invoice" ref="invoice" v-show="invoiceshow">
      <div class="ibTop">
        <div>原州区乡村供水水费专业收据</div>
        <!-- <div class="logo">农村饮水工程<br>收费专用发票</div>
        <div class="allshowNumber">{{basic.thisInvoice}}</div>
        <p>
          <span>{{times}}</span>
          <span>水的生产和供应业</span>
        </p> -->
      </div>
      <div class="unallshowContent">
        <div style="display:flex;justify-content:flex-end;">
          <div><span style="font-size:18px;font-weight: bold;margin-right:10px;">NO:</span> <span style="font-size:18px;color:red;font-weight: bold;">0066644</span></div>
        </div>
        <div class="topP1">
          <p>
            <em>用水户 : </em>
            <span>{{userDetails.userInfo.realName}}</span>
          </p>
          <p>
            <!-- <span>2019年6月24日</span> -->
            <span>{{userDetails.time}}</span>
          </p>
          <!-- <p>
            <em>用户名称 : </em>
            <span>{{userDetails.userInfo.realName}}</span>
          </p>
          <p>
            <em>用户编号 : </em>
            <span>{{userDetails.userCode}}</span>
          </p>
          <p>
            <em>机打票号 : </em>
            <span>{{basic.thisInvoice}}</span>
          </p> -->
        </div>
        <div class="topP">
          <!-- <p>
            <em>用户地址 : </em>
            <span>{{userDetails.detailedAddress}}</span>
          </p>
          <p>
            <em>户基本水量 : </em>
            <span>0.0m³/月</span>
          </p>
          <p>
            <em>执行水价 : </em>
            <span>{{basic.price}}</span>
          </p> -->
        </div>
        <table border="1px solid #ccc"
          cellspacing="0"
          cellpadding="0">
          <tr>
            <th>本期缴费</th>
            <th>本期余额</th>
          </tr>
          <tr>
            <td>{{userDetails.payMoeny}}</td>
            <td>{{userDetails.balance}}</td>
          </tr>
        </table>
        <div style="margin-bottom: 30px;width: 100%;box-sizing:border-box; border:1px solid black;border-top:0px;height:40px;display:flex;"><div style="line-height:40px;border-right:1px solid black;padding:0 10px;">人民币(大写)</div><div style="line-height:40px;text-align:center;flex:1">{{userDetails.bigpayMoney}}</div></div>
        <!-- <table>
          <tr>
            <th>所属日期</th>
            <th>充值水费</th>
          </tr>
          <tr>
            <td>{{userDetails.time}}</td>
            <td>{{userDetails.payMoeny}}</td>
          </tr>
        </table> -->
        <div class="bottomP">
          <p>
            <em>单位(盖章): </em>
            <span></span>
          </p>
          <p>
            <em>收费人: </em>
            <span>{{adminName}}</span>
          </p>
          <p>
            <em>缴费人: </em>
            <span>{{userDetails.userInfo.realName}}</span>
          </p>
          <!-- <p>
            <em>本期缴费 : </em>
            <span>{{userDetails.payMoeny}}</span>
          </p>
          <p>
            <em>大写: </em>
            <span>{{userDetails.bigpayMoney}}</span>
          </p> -->
        </div>
        <!-- <div class="bottomP"
          v-show="userDetails.yucun > 0">
          <p>
            <em>其中预存水费 : </em>
            <span>{{userDetails.yucun}}</span>
          </p>
          <p>
            <em>大写 : </em>
            <span>{{userDetails.bigyucun}}</span>
          </p>
        </div> -->
        <!-- <div class="bottomP">
          <p>
            <em>本期余额 : </em>
            <span>{{userDetails.balance}}</span>
          </p>
          <p>
            <em>大写 : </em>
            <span>{{userDetails.bigBalance}}</span>
          </p>
        </div> -->
        <!-- <div class="bottomP">
          <p>
            <em>收款单位 : </em>
            <span>{{basic.companyName}}</span>
          </p>
          <p>
            <em>开户银行 : </em>
            <span>{{basic.bank}}</span>
          </p>
        </div> -->
        <!-- <div class="bottomP">
          <p>
            <em>联系电话 : </em>
            <span>{{basic.telephone}}</span>
          </p>
          <p>
            <em>银行账号 : </em>
            <span>{{basic.bankAccount}}</span>
          </p>
        </div> -->
        <!-- <div class="bottomP">
          <p>
            <em>开票人 : </em>
            <span>{{adminName}}</span>
          </p>
          <p>
            <em>收款人</em>
            <span>{{adminName}}</span>
          </p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import minToMax from '@/assets/js/minToMax'
export default {
  name: 'Recharge',
  data () {
    let moneys = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else {
        let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
        if (!reg.test(value)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      adminName: JSON.parse(localStorage.getItem('userMsg')).name,
      invoiceshow: false,
      rechargeDig: false,
      userDetails: {
        userInfo: {}
      },
      times: '',
      basic: '',
      form: {
        page: 1,
        size: 10,
        eltotalCount: 0,
        meterCode: null,
        status: 'NORMAL',
        userCode: null
      },
      tableData: [],
      ruleForm: {
        id: null,
        userCode: null,
        username: null,
        waterid: null,
        money: null,
        waterType: '1',
        payType: 'CASH',
        print: '1'
      },
      rules: {
        money: [{ required: true, validator: moneys, trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    digClose () {
      this.$refs['refruleForm'].resetFields()
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.meterCode = null
      this.form.userCode = null
      this.initData()
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getUserList(this.form)
      if (Object.is(res.code, 200)) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('用户信息获取失败')
    },
    // 充值提交
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$api.sso.payWater({
            id: this.ruleForm.id,
            money: this.ruleForm.money,
            userCode: this.ruleForm.userCode,
            payType: this.ruleForm.payType
          })
          if (res.code === 200) {
            this.$message.success('充值成功')
            switch (this.ruleForm.print) {
              case '1':
                this.userDetails.time = setTime({ type: 2 })
                this.times = setTime({ type: 2 })
                let ress = await this.$api.sso.getInvoiceSetingMsg({ count: 1 })
                if (ress.code === 200) {
                  this.basic = ress.data
                  this.userDetails.yucun = this.userDetails.balance.toFixed(2)
                  this.userDetails.bigyucun = minToMax(this.userDetails.yucun)
                  this.userDetails.payMoeny = Number(this.ruleForm.money).toFixed(2)
                  this.userDetails.bigpayMoney = minToMax(this.userDetails.payMoeny)
                  this.userDetails.balance = (this.userDetails.balance + Number(this.ruleForm.money)).toFixed(2)
                  this.userDetails.bigBalance = minToMax(this.userDetails.balance)
                  this.initData()
                  this.invoiceshow = true
                  setTimeout(() => {
                    this.$print(this.$refs.invoice)
                    this.invoiceshow = false
                    this.rechargeDig = false
                  }, 100)
                } else this.$message.error('参数据说获取失败')
                break
              case '2':
                this.rechargeDig = false
                this.initData()
                break
            }
          } else this.$message.error('充值失败')
        } else this.$message.error('请完善充值信息')
      })
    },
    // 点击充值水费
    recharge (data) {
      this.userDetails = data
      this.ruleForm.id = data.id
      this.ruleForm.userCode = data.userCode
      this.ruleForm.username = data.userInfo.realName
      this.ruleForm.waterid = data.meterCode
      this.rechargeDig = true
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
    // 改变表头颜色
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    }
  }
}
</script>

<style lang="scss" scoped>
#invoice {
  font-size: 12px;
  width: 650px;

  .ibTop {
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    .logo {
      border: 1px solid #000;
      display: inline-block;
      padding: 3px 5px;
      margin-left: 150px;
    }

    .allshowNumber {
      font-size: 18px;
      text-align: right;
      margin-right: 50px;
    }

    p {
      span {
        margin: 0 90px;
      }
    }
  }

  .unallshowContent {
    padding: 25px 20px;

    .topP1 {
      display: flex;
      justify-content: space-between;
      p {
        margin-bottom: 20px;

        em {
          margin-right: 10px;
        }
      }
    }
    .topP {
      display: flex;
      p {
        width: 33.3%;
        margin-bottom: 20px;

        em {
          margin-right: 10px;
        }
      }
    }

    table {
      font-size: 12px;
      width: 100%;
      th {
        width: 67px;
        text-align: center;
        height: 40px;
      }

      th:nth-child(1) {
        width: 134px;
      }

      td {
        text-align: center;
        height: 40px;
      }

      // margin-bottom: 30px;
    }

    .bottomP {
      display: flex;

      p {
        width: 40%;
        margin-bottom: 20px;

        em {
          margin-right: 10px;
        }
      }

      p:nth-child(2) {
        width: 60%;
      }
    }
  }
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
