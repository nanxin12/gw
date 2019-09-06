<template>
  <div class="templateBox">
    <div class="tbContent">
      <h3>宁夏回族自治区国家税务局通用机打发票</h3>
      <h4>发票联</h4>
      <div class="titlt">
        <span>开票日期 : </span>
        <em>{{times}}</em>
        <span>行业分类 : </span>
        <em>水的生产和供应类</em>
      </div>
      <div class="messageBox">
        <div class="top">
          <p>
            <span>用户名称 : </span>
            <em>XXX</em>
          </p>
          <p>
            <span>用户编号 : </span>
            <em>XXX</em>
          </p>
          <p>
            <span>机打号码 : </span>
            <em>{{datas.thisInvoice}}</em>
          </p>
        </div>
        <div class="top">
          <p>
            <span>用户地址 : </span>
            <em>XXX</em>
          </p>
          <p>
            <span>户基本水量：</span>
            <em>0.00m³/月</em>
          </p>
          <p>
            <span>执行水价：</span>
            <em>{{datas.price}}</em>
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
          <tr>
            <td>xxx</td>
            <td>xxx</td>
            <td>xxx</td>
            <td>xxx</td>
            <td>xxx</td>
            <td>xxx</td>
            <td></td>
            <td>xxx</td>
            <td>xxx</td>
          </tr>
        </table>
        <p>
          <span>本期缴费 : </span>
          <em>xxx</em>
          <span>大写 : </span>
          <em>xxx</em>
        </p>
        <p>
          <span>预存水费 : </span>
          <em>xxx</em>
          <span>大写 : </span>
          <em>xxx</em>
        </p>
        <p>
          <span>本期余额 : </span>
          <em>xxx</em>
          <span>大写 : </span>
          <em>xxx</em>
        </p>
        <p>
          <span>收款单位 : </span>
          <em>{{datas.companyName}}</em>
          <span>开户银行 : </span>
          <em>{{datas.bank}}</em>
        </p>
        <p>
          <span>联系电话 : </span>
          <em>{{datas.telephone}}</em>
          <span>银行账号 : </span>
          <em>{{datas.bankAccount}}</em>
        </p>
        <p>
          <span>开票人 : </span>
          <em>{{userName}}</em>
          <span>收款人 : </span>
          <em>{{userName}}</em>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'Template',
  data () {
    return {
      times: setTime({ type: 2 }),
      datas: {},
      userName: JSON.parse(localStorage.getItem('userMsg')).name
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      let res = await this.$api.sso.getSetingMsg()
      if (res.code === 200) {
        this.datas = res.data
      } else this.$message.error('数据获取失败')
    }
  }
}
</script>

<style lang="scss" scoped>
  .tbContent {
    width: 800px;
    height: 600px;
    margin: 0 auto;
    padding: 30px;
    background: #fff;
    border-radius: 10px;

    h3 {
      color: #8a685f;
      font-size: 18px;
      text-align: center;
      margin-bottom: 10px;
    }

    h4 {
      color: #8a685f;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 10px;
    }

    .titlt {
      margin-bottom: 5px;

      span {
        color: #8a685f;
      }

      em {
        color: #155ecb;
        margin-right: 145px;
      }
    }

    .messageBox {
      box-sizing: border-box;
      border: 1px solid #8a685f;
      width: 100%;
      height: 505px;
      padding: 10px;

      .top {
        display: flex;

        p {
          width: 33%;
        }
      }

      em {
        margin-right: 145px;
      }

      p {
        color: #155ecb;
        height: 40px;
        line-height: 40px;
      }

      table {
        color: #155ecb;
        height: 170px;

        th:nth-child(1) {
          width: 108px;
        }

        th {
          width: 86px;
        }

        td {
          text-align: center;
        }
      }
    }
  }
</style>
