<template>
  <div class="invoiceBox">
    <el-form :inline="true"
      :model="form"
      label-width="100px"
      label-position="right">
      <el-form-item label="开始日期:">
        <el-date-picker type="date"
          placeholder="选择开始日期"
          style="width: 202px"
          v-model="form.startTime"
          value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间:">
        <el-date-picker type="date"
          placeholder="选择截止日期"
          style="width: 202px"
          v-model="form.endTime"
          value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
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
          @click="reset">重置内容</el-button>
        <el-button v-has="{type: 'invoice'}"
          type="primary"
          @click="dayin"
          style="margin: 0 10px">补打发票</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          @selection-change="handleSelectionChange"
          border
          :header-cell-style="tableHeaderColor">
          <el-table-column type="selection"
            width="55"
            align="center"></el-table-column>
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode"
            label="用户编号"
            align="center"></el-table-column>
          <el-table-column prop="realName"
            label="用户姓名"
            align="center"></el-table-column>
          <el-table-column prop="meterCode"
            label="水表编号"
            align="center"></el-table-column>
          <el-table-column prop="phone"
            label="手机号码"
            align="center"></el-table-column>
          <el-table-column prop="detailedAddress"
            label="所属区域"
            align="center"></el-table-column>
          <el-table-column prop="payTime"
            label="出账时间"
            align="center"></el-table-column>
          <el-table-column prop="waterYield"
            label="当月用水量(吨)"
            align="center"></el-table-column>
          <el-table-column prop="lastMonthYield"
            label="上月累计数(吨)"
            align="center"></el-table-column>
          <el-table-column prop="thisMonthYield"
            label="本月累计数(吨)"
            align="center"></el-table-column>
          <el-table-column label="应扣金额(元)"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.payMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column label="实扣金额(元)"
            align="center">
            <template slot-scope="scope">
              <span>{{scope.row.realPayMoney | money}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance"
            label="余额(元)"
            align="center"></el-table-column>
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
    <div v-show="unallshow"
      ref="listbox">
      <ul>
        <li v-for="(item,index) in invoicedata"
          :key="index"
          style="page-break-before:always">
          <div class="invoiceBoxtwo">
            <div class="unallshowTop">
              <div class="logo">农村饮水工程<br>收费专用发票</div>
              <div class="allshowNumber">{{basic.thisInvoice+index}}</div>
              <p>
                <span>{{times}}</span>
                <span>水的生产和供应业</span>
              </p>
            </div>
            <div class="unallshowContent">
              <div class="topP">
                <p style="margin-right: 90px;">
                  <em>用户名称 : </em>
                  <span>{{item.realName}}</span>
                </p>
                <p style="margin-right: 15px;">
                  <em>用户编号 : </em>
                  <span>{{item.userCode}}</span>
                </p>
                <p>
                  <em>机打票号 : </em>
                  <span>{{basic.thisInvoice+index}}</span>
                </p>
              </div>
              <div class="topP">
                <p style="margin-bottom:5px;width:40%">
                  <em>用户地址 : </em>
                  <span>{{item.detailedAddress}}</span>
                </p>
                <p style="margin-bottom:5px;width:28%">
                  <em>户基本水量 : </em>
                  <span>120.0m³/月</span>
                </p>
                <p style="margin-bottom:5px;">
                  <em>执行水价 : </em>
                  <span>{{basic.price}}</span>
                </p>
              </div>
              <table>
                <tr>
                  <th>所属期</th>
                  <th>水表起码</th>
                  <th>水表止码</th>
                  <th>实用水量</th>
                  <th>收费水量</th>
                  <th>超额水量</th>
                  <th>超额水价</th>
                  <th>应缴水费</th>
                  <th>滞纳金</th>
                </tr>
                <tr style="height: 16px;"></tr>
                <tr>
                  <td>{{item.payTime}}</td>
                  <td>{{item.lastMonthYield}}</td>
                  <td>{{item.thisMonthYield}}</td>
                  <td>{{item.waterYield}}</td>
                  <td>{{item.waterYield}}</td>
                  <td>0.00</td>
                  <td>0.00</td>
                  <td>{{item.payMoney.toFixed(2)}}</td>
                  <td>0.00</td>
                </tr>
              </table>
              <div class="bottomP">
                <p>
                  <em>本期缴费 : </em>
                  <span>{{item.payMoney.toFixed(2)}}</span>
                </p>
                <p>
                  <em>大写: </em>
                  <span>{{item.bigPayMoney}}</span>
                </p>
              </div>
              <div class="bottomP"
                v-show="item.prestore > 0">
                <p>
                  <em>其中预存水费 : </em>
                  <span>{{item.prestore.toFixed(2)}}</span>
                </p>
                <p>
                  <em>大写 : </em>
                  <span>{{item.bigPrestore}}</span>
                </p>
              </div>
              <div class="bottomP">
                <p>
                  <em>本期余额 : </em>
                  <span>{{item.balance.toFixed(2)}}</span>
                </p>
                <p>
                  <em>大写 : </em>
                  <span>{{item.bigBalance}}</span>
                </p>
              </div>
              <div class="bottomP">
                <p>
                  <em>收款单位 : </em>
                  <span>{{basic.companyName}}</span>
                </p>
                <p>
                  <em>开户银行 : </em>
                  <span>{{basic.bank}}</span>
                </p>
              </div>
              <div class="bottomP">
                <p>
                  <em>联系电话 : </em>
                  <span>{{basic.telephone}}</span>
                </p>
                <p>
                  <em>银行账号 : </em>
                  <span>{{basic.bankAccount}}</span>
                </p>
              </div>
              <div style="display: flex;">
                <p style="width:30%">
                  <em>开票人 : </em>
                  <span>{{adminName}}</span>
                </p>
                <p>
                  <em>收款人 : </em>
                  <span>{{adminName}}</span>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-show="allshow"
      ref="invoiceBox"
      class="allshow">
      <div class="allshowTop">
        <div class="logo">农村饮水工程<br>收费专用发票</div>
        <div class="allshowNumber">{{basic.thisInvoice}}</div>
        <p>
          <span>{{times}}</span>
          <span>水的生产和供应业</span>
        </p>
      </div>
      <div class="allshowContent">
        <div class="acTop">
          <p style="margin-right: 90px;">
            <em>用户名称 : </em>
            <span>{{all.username}}</span>
          </p>
          <p style="margin-right: 15px;">
            <em>用户编号 : </em>
            <span>{{all.userCode}}</span>
          </p>
          <p>
            <em>机打票号 : </em>
            <span>{{basic.thisInvoice}}</span>
          </p>
        </div>
        <div class="acTop">
          <p style="margin-bottom:5px;width:40%">
            <em>用户地址 : </em>
            <span>{{all.adders}}</span>
          </p>
          <p style="margin-bottom:5px;width:28%">
            <em>户基本水量 : </em>
            <span>0.0m³/月</span>
          </p>
          <p style="margin-bottom:5px;">
            <em>执行水价 : </em>
            <span>{{basic.price}}</span>
          </p>
        </div>
        <table>
          <tr>
            <th>所属日期</th>
            <th>水表起码</th>
            <th>水表止码</th>
            <th>实用水量</th>
            <th>收费水量</th>
            <th>超额水量</th>
            <th>超额水价</th>
            <th>应缴水费</th>
            <th>滞纳金</th>
          </tr>
          <tr style="height: 16px;"></tr>
          <tr>
            <td>{{all.starttime+'-'+all.endtime}}</td>
            <td>{{all.lastMonthYield}}</td>
            <td>{{all.thisMonthYield}}</td>
            <td>{{all.waterYield}}</td>
            <td>{{all.waterYield}}</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>{{all.payMoney}}</td>
            <td>0.00</td>
          </tr>
        </table>
        <div class="acBottom">
          <p>
            <em>合计缴费 : </em>
            <span>{{all.payMoney}}</span>
          </p>
          <p>
            <em>大写: </em>
            <span>{{all.bigpayMoney}}</span>
          </p>
        </div>
        <div class="acBottom">
          <p>
            <em>合计余额 : </em>
            <span>{{all.balance}}</span>
          </p>
          <p>
            <em>大写: </em>
            <span>{{all.bigBalance}}</span>
          </p>
        </div>
        <div class="acBottom">
          <p>
            <em>收款单位 : </em>
            <span>{{basic.companyName}}</span>
          </p>
          <p>
            <em>开户银行 : </em>
            <span>{{basic.bank}}</span>
          </p>
        </div>
        <div class="acBottom">
          <p>
            <em>联系电话 : </em>
            <span>{{basic.telephone}}</span>
          </p>
          <p>
            <em>银行账号 : </em>
            <span>{{basic.bankAccount}}</span>
          </p>
        </div>
        <div style="display: flex;">
          <p style="width:30%">
            <em>开票人 : </em>
            <span>{{adminName}}</span>
          </p>
          <p>
            <em>收款人 : </em>
            <span>{{adminName}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import minToMax from '@/assets/js/minToMax'
export default {
  name: 'Invoice',
  data () {
    return {
      adminName: JSON.parse(localStorage.getItem('userMsg')).name,
      allshow: false,
      unallshow: false,
      times: null,
      form: {
        eltotalCount: 0,
        page: 1,
        size: 10,
        endTime: null,
        meterCode: null,
        startTime: null,
        userCode: null
      },
      tableData: [],
      invoicedata: '',
      basic: '',
      all: {}
    }
  },
  created () {
    this.initData()
  },
  methods: {
    // 表格转时间
    formatter (row) {
      if (row.payTime) return setTime({ date: row.payTime, number: 1000 })
      else return '暂无数据'
    },
    // 改变表头颜色
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getBill(this.form)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
        this.tableData.forEach(item => {
          item.payTime = setTime({ date: item.payTime, number: 1000, type: 2 })
        })
      } else this.$message.error('账单信息获取失败')
    },
    // 打印发票
    dayin () {
      let length = this.invoicedata.length
      if (length > 0) {
        let userCode = this.invoicedata[0].userCode
        let type = 0
        for (let i = 0; i < length; i++) {
          if (this.invoicedata[i].userCode !== userCode) {
            type = 1
            break
          }
        }
        let count = null
        if (type === 0 && length > 1) {
          this.$confirm('此操作将合并打印发票', '是否合票', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }).then(() => {
            count = 1
            this.$api.sso.getInvoiceSetingMsg({ count }).then(res => {
              if (res.code === 200) {
                this.basic = res.data
                this.invoicedata = this.invoicedata.reverse()
                this.all.starttime = this.invoicedata[0].payTime
                this.all.endtime = this.invoicedata[this.invoicedata.length - 1].payTime
                this.all.username = this.invoicedata[0].realName
                this.all.userCode = this.invoicedata[0].userCode
                this.all.adders = this.invoicedata[0].detailedAddress
                this.all.lastMonthYield = this.invoicedata[0].lastMonthYield
                this.all.thisMonthYield = this.invoicedata[this.invoicedata.length - 1].thisMonthYield
                this.all.balance = this.invoicedata[this.invoicedata.length - 1].balance
                this.all.bigBalance = minToMax(this.all.balance)
                this.all.waterYield = 0
                this.all.payMoney = 0
                this.invoicedata.forEach((item) => {
                  this.all.waterYield += item.waterYield
                  this.all.payMoney += item.payMoney
                })
                this.all.payMoney = this.all.payMoney.toFixed(2)
                this.all.bigpayMoney = minToMax(this.all.payMoney)
                this.times = setTime({ data: new Date(), type: 2 })
                this.allshow = true
                setTimeout(() => {
                  this.$print(this.$refs.invoiceBox)
                  this.allshow = false
                }, 100)
              } else this.$message.error('参数信息获取失败')
            })
          }).catch(() => {
            count = length
            this.unGroupPrint(count)
          })
        } else {
          count = length
          this.unGroupPrint(count)
        }
      } else this.$message.error('请先选择用户')
    },
    // 不合票打印
    unGroupPrint (count) {
      this.$api.sso.getInvoiceSetingMsg({ count }).then(res => {
        if (res.code === 200) {
          this.basic = res.data
          this.times = setTime({ data: new Date(), type: 2 })
          this.unallshow = true
          setTimeout(() => {
            this.$print(this.$refs.listbox)
            this.unallshow = false
          }, 100)
        } else this.$message.error('参数信息获取失败')
      })
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
    },
    // 点击表格选择框
    handleSelectionChange (val) {
      this.invoicedata = []
      val.forEach(item => {
        item.bigPayMoney = minToMax(item.payMoney)
        item.balance = Number(item.balance)
        item.bigBalance = minToMax(item.balance)
        item.prestore = item.payMoney + item.balance
        item.bigPrestore = minToMax(item.prestore)
      })
      this.invoicedata = val
    }
  }
}
</script>

<style lang="scss" scoped>
.invoiceBoxtwo {
  font-size: 12px;
  width: 690px;
  padding-left: 40px;

  .unallshowTop {
    .logo {
      border: 1px solid #000;
      display: inline-block;
      padding: 3px 5px;
      margin-left: 150px;
    }

    .allshowNumber {
      font-size: 18px;
      text-align: right;
      margin-right: 10px;
    }

    p {
      span {
        margin: 0 90px;
      }
    }
  }

  .unallshowContent {
    padding: 25px 20px;

    .topP {
      display: flex;

      p {
        // width: 33.3%;
        margin-bottom: 20px;

        em {
          margin-right: 10px;
        }
      }
    }

    table {
      font-size: 12px;

      th {
        // width: 67px;
        // text-align: center;
        padding: 0 8px;
      }

      th:nth-child(1) {
        width: 60px;
        padding: 0 16px 0 0;
      }

      td {
        text-align: center;
      }

      margin-bottom: 30px;
    }

    .bottomP {
      display: flex;

      p {
        flex: 1;
        margin-bottom: 7px;
        display: flex;

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

.allshow {
  font-size: 12px;
  width: 690px;
  padding-left: 40px;

  .allshowTop {
    .logo {
      border: 1px solid #000;
      display: inline-block;
      padding: 3px 5px;
      margin-left: 150px;
    }

    .allshowNumber {
      font-size: 18px;
      text-align: right;
      margin-right: 20px;
    }

    p {
      span {
        margin: 0 90px;
      }
    }
  }

  .allshowContent {
    padding: 25px 20px;

    .acTop {
      display: flex;

      p {
        // width: 33.3%;
        margin-bottom: 20px;

        em {
          margin-right: 10px;
        }
      }
    }

    table {
      font-size: 12px;

      th {
        // width: 67px;
        padding: 0 8px;
      }

      th:nth-child(1) {
        width: 60px;
        padding: 0 16px 0 0;
      }

      td {
        text-align: center;
      }
      td:nth-child(1) {
        text-align: left;
        width: 60px;
      }

      margin-bottom: 30px;
    }

    .acBottom {
      display: flex;

      p {
        // width: 40%;
        flex: 1;
        margin-bottom: 7px;

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
