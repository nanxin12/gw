<template>
  <div class="parameterBox">
    <div class="pbContent">
      <Titles txt="系统参数"></Titles>
      <el-form :model="setting" :rules="rules" ref="refruleForm" label-position="right" label-width="130px"
               class="demo-ruleForm">
        <el-form-item label="出账日:" prop="accountTime">
          <el-input v-model="setting.accountTime" placeholder="出账日" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发票号:" prop="invoice">
          <el-input v-model="setting.invoice" placeholder="发票号" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="客服电话:" prop="telephone">
          <el-input v-model="setting.telephone" placeholder="客服电话" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="收费单位:" prop="companyName">
          <el-input v-model="setting.companyName" placeholder="收费单位" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="开户银行:" prop="bank">
          <el-input v-model="setting.bank" placeholder="开户银行" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="银行账号:" prop="bankAccount">
          <el-input v-model="setting.bankAccount" placeholder="银行账号" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="当前发票号:" prop="thisInvoice">
          <el-input v-model="setting.thisInvoice" placeholder="当前发票号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="运维手机号:" prop="operation">
          <el-input v-model="setting.operation" placeholder="运维手机号" :disabled="updata"></el-input>
        </el-form-item>
        <el-form-item label="余额不足通知:" prop="balanceDueDate">
          <el-input v-model="setting.balanceDueDate" placeholder="余额不足通知" :disabled="updata"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="pbBottom">
      <el-button v-has="{type: 'update'}" type="primary" @click="compile" style="margin: 0 25px">编辑参数</el-button>
      <el-button v-has="{type: 'cancel'}" type="primary" @click="cancel" style="margin: 0 25px">取消编辑</el-button>
      <el-button v-has="{type: 'save'}" type="primary" @click="submit('refruleForm')" style="margin: 0 25px">保存参数</el-button>
    </div>
  </div>
</template>

<script>
import Titles from '@/components/maintain/Titles'
export default {
  name: 'Parameter',
  components: {
    Titles
  },
  data () {
    let phones = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        let reg = /^1\d{10}$/
        if (!reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    let loadphones = (rule, value, callback) => {
      if (!value) {
        callback(new Error('电话号码不能为空'))
      } else {
        let reg = /^\d{8}$/
        if (!reg.test(value)) {
          callback(new Error('电话号码格式不正确'))
        } else {
          callback()
        }
      }
    }
    let moneys = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('金额格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      setting: {},
      updata: true,
      rules: {
        telephone: [{ required: true, validator: loadphones, trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        balanceDueDate: [{ required: true, validator: moneys, trigger: 'blur' }],
        bank: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
        bankAccount: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
        invoice: [{ required: true, message: '请输入发票编号', trigger: 'blur' }],
        operation: [{ required: true, validator: phones, trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initdata()
  },
  mounted () {

  },
  methods: {
    cancel () {
      this.updata = true
      this.initdata()
    },
    async initdata () {
      let res = await this.$api.sso.getSetingMsg()
      if (res.code === 200) {
        this.setting = res.data
      } else this.$message.error('数据获取失败')
    },
    // 编辑参数开始
    compile () {
      this.updata = false
    },
    // 修改提交
    submit (formName) {
      if (!this.updata) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res = await this.$api.sso.putSetingMsg(this.setting)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.cancel()
            } else this.$message.error('修改失败')
          } else this.$message.error('请填写设置参数')
        })
      } else {
        this.$message.error('请先编辑参数')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .parameterBox {
    min-height: 100%;
    background: #fff;

    .pbContent {
      width: 100%;
      .demo-ruleForm {
        width: 450px;
        margin: 0 auto;
      }
    }

    .pbBottom {
      padding: 50px 0 20px 0;
      text-align: center;
    }
  }
</style>
