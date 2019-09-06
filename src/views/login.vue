<template>
  <div class="loginBox">
    <div class="title">原州区智慧水务监测平台</div>
    <div class="formBox"
      @keydown.enter="login('refloginform')">
      <div style="padding:21px 90px 19px 90px;overflow: hidden;">
        <div class="tabs"
          style="float:left"
          :class="{'addTabs': this.state === '1'}"
          @click="tabs('1')">账号密码登录</div>
        <div class="tabs"
          style="float:right"
          :class="{'addTabs': this.state === '2'}"
          @click="tabs('2')">手机号码登录</div>
      </div>
      <div style="width:500px;height:1px;background:rgba(0,0,0,1);opacity:0.05;"></div>
      <div class="slider"
        :class="{'sliderRight': this.state === '2'}"></div>
      <div style="margin-top: 34px;padding: 0 90px;">
        <div v-if="this.state === '1'">
          <div style="margin-bottom:20px;">
            <div>
              <span style="font-size:12px;font-weight:400;color:rgba(96,98,102,1);margin-right:15px;">用户名</span>
              <span class="warning">{{this.rulloginform.name}}</span>
            </div>
            <div>
              <el-input v-model="loginForm.name"
                placeholder="请输入内容">
                <i slot="prefix"
                  class="name">
                  <img src="../assets/img/name.png"
                    alt=""
                    srcset="">
                </i>
              </el-input>
            </div>
          </div>
          <div style="margin-bottom:30px;">
            <div>
              <span style="font-size:12px;font-weight:400;color:rgba(96,98,102,1);margin-right:15px;">密码</span>
              <span class="warning">{{this.rulloginform.password}}</span>
            </div>
            <div>
              <el-input v-model="loginForm.password"
                show-password
                placeholder="请输入密码">
                <i slot="prefix"
                  class="name">
                  <img src="../assets/img/pwd.png"
                    alt=""
                    srcset="">
                </i>
              </el-input>
            </div>
          </div>
        </div>
        <div v-if="this.state === '2'">
          <div style="margin-bottom:20px;">
            <div>
              <span style="font-size:12px;font-weight:400;color:rgba(96,98,102,1);margin-right:15px;">手机号码</span>
              <span class="warning">{{this.rulloginform.phone}}</span>
            </div>
            <div>
              <el-input v-model="loginForm.phone"
                @blur.prevent="onblur(loginForm.phone)"
                placeholder="请输入手机号码">
                <i slot="prefix"
                  class="name">
                  <img src="../assets/img/name.png"
                    alt=""
                    srcset="">
                </i>
              </el-input>
            </div>
          </div>
          <div style="margin-bottom:30px;">
            <div>
              <span style="font-size:12px;font-weight:400;color:rgba(96,98,102,1);margin-right:15px;">验证码</span>
              <span class="warning">{{this.rulloginform.code}}</span>
            </div>
            <div class="code">
              <el-input v-model="loginForm.code"
                placeholder="请输入验证码">
                <i slot="prefix"
                  class="name">
                  <img src="../assets/img/pwd.png"
                    alt=""
                    srcset="">
                </i>
              </el-input>
              <el-button round
                v-if="tabsBtn"
                class="codeBtn"
                size='mini'
                type="primary"
                :disabled='codeBtn'
                @click="sendCode">发送验证码</el-button>
              <div class="time"
                v-if="!tabsBtn">{{codeTime}}</div>
            </div>
          </div>
        </div>

        <div style="display: flex;justify-content: center;align-items: center;">
          <div class="sumbit"
            @click="login('refloginform')">登 录</div>
          <!-- <el-button type="primary"
            class="sumbit"
            @click="login('refloginform')"
            round>登 录</el-button> -->
        </div>
      </div>
      <!-- <el-form :model="loginForm"
        :rules="rulloginform"
        ref="refloginform"
        label-width="0px"
        class="login-container">
        <el-form-item prop="name"
          class="inputs">
          <el-input type="text"
            v-model="loginForm.name"
            prefix-icon="iconfont icon-yonghu1"
            placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item prop="password"
          class="inputs">
          <el-input type="password"
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            placeholder="请输入登录密码"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button class="sumbit"
            type="primary"
            @click="login('refloginform')"
            width="100%">登 录</el-button>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      tabsBtn: true,
      codeTime: '',
      loginForm: {
        name: '',
        password: '',
        phone: '',
        code: ''
      },
      rulloginform: {
        name: '',
        password: '',
        phone: '',
        code: ''
      },
      codeBtn: true,
      state: '1'
    }
  },
  methods: {
    sendCode () {
      this.$api.home.verifyCode({ account: this.loginForm.phone }).then((res) => {
        if (res.code === 200) {
          let num = 60
          let a = setInterval(() => {
            if (num === 0) {
              clearInterval(a)
              this.tabsBtn = true
            } else {
              this.tabsBtn = false
              num--
              this.codeTime = `剩余${num}秒`
            }
          }, 1000)
        } else {
          this.$message.error('短信发送错误')
        }
      })
    },
    onblur (val) {
      if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginForm.phone))) {
        this.rulloginform.phone = '请输入正确的手机号码'
        this.codeBtn = true
      } else {
        this.rulloginform.phone = ''
        this.codeBtn = false
      }
    },
    tabs (val) {
      this.state = val
      this.loginForm.name = ''
      this.loginForm.password = ''
      this.loginForm.phone = ''
      this.loginForm.code = ''
      this.rulloginform.name = ''
      this.rulloginform.password = ''
      this.rulloginform.phone = ''
      this.rulloginform.code = ''
    },
    login (formName) {
      let switchsOne = true
      let switchsTwo = true
      if (this.state === '1') {
        if (this.loginForm.name === '') {
          this.rulloginform.name = '请输入用户名'
          switchsOne = false
        } else {
          this.rulloginform.name = ''
          switchsOne = true
        }
        if (this.loginForm.password === '') {
          this.rulloginform.password = '请输入密码'
          switchsTwo = false
        } else {
          this.rulloginform.password = ''
          switchsTwo = true
        }
      }
      if (this.state === '2') {
        if (this.loginForm.phone === '') {
          this.rulloginform.phone = '请输入手机号码'
          switchsOne = false
        } else {
          if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginForm.phone))) {
            this.rulloginform.phone = '请输入正确的手机号码'
            switchsOne = false
          } else {
            this.rulloginform.phone = ''
            switchsOne = true
          }
        }
        if (this.loginForm.code === '') {
          this.rulloginform.code = '请输入验证码'
          switchsTwo = false
        } else {
          this.rulloginform.code = ''
          switchsTwo = true
        }
      }
      if (switchsTwo && switchsOne) {
        let { name, password, phone, code } = this.loginForm
        let data = {}
        if (this.state === '1') {
          data = { account: name, pass: password }
        } else {
          data = { account: phone, pass: code }
        }
        // let data = { account: this.loginForm.name, pass: this.loginForm.password }
        this.$api.home.login(data).then((res) => {
          if (res.code === 200) {
            let users = {
              name: res.data.username,
              id: res.data.userId,
              token: res.data.token,
              time: new Date().getTime()
            }
            this.$parent.initSoekct(res.data.userId)
            localStorage.setItem('userMsg', JSON.stringify(users))
            this.$router.push('/')
          } else {
            this.$message.error('用户名户密码错误')
          }
        })
      }
    }
  },
  created () {
    if (this.$parent.socket) {
      this.$parent.overWebSocket()
    }
  }
}
</script>

<style lang="scss" scoped>
.warning {
  font-weight: 400;
  color: rgba(255, 90, 98, 1);
  font-size: 12px;
}
.time {
  text-align: center;
  width: 90px;
  height: 26px;
  line-height: 26px;
  border: 1px solid rgba(40, 130, 255, 1);
  border-radius: 13px;
  position: absolute;
  right: 0;
  bottom: 0;
  color: #2882ff;
  box-sizing: border-box;
}
.codeBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 90px;
  height: 26px;
  padding: 0;
}
.loginBox /deep/ .el-input__inner {
  width: 100%;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  border-radius: 0;
  /*outline: medium;*/
}
.code /deep/ .el-input {
  width: 70%;
}
.code {
  position: relative;
}
.loginBox /deep/ .el-input__prefix {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  position: absolute;
  left: 50%;
  top: 37%;
  margin-left: -240px;
  margin-top: -170px;
  font-size: 40px;
  font-family: PangMenZhengDao;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  // margin-bottom: 81px;
}
.tabs {
  font-size: 14px;
  font-family: SourceHanSansSC-Regular;
  font-weight: 400;
  color: rgba(40, 130, 255, 1);
  cursor: pointer;
  // padding: 0 60px;
}
.addTabs {
  font-size: 16px;
  font-family: SourceHanSansSC-Bold;
  font-weight: bold;
  color: rgba(40, 129, 255, 1);
}
.slider {
  position: absolute;
  left: 116px;
  top: 60px;
  width: 40px;
  height: 4px;
  background: rgba(40, 130, 255, 1);
  border-radius: 2px;
  transition: all 0.4s ease;
}
.sliderRight {
  left: 344px;
}
.loginBox {
  height: 100%;
  background: url("../assets/img/login_bg.png");
  background-size: 100% 100%;
  position: relative;
  // display: flex;
  // justify-content: center;
  // align-items: center;

  .formBox {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -170px;
    width: 500px;
    height: 340px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 30px 0px rgba(102, 190, 255, 0.4);
    border-radius: 10px;

    h2 {
      text-align: center;
      font-size: 24px;
      line-height: 100px;
      height: 100px;
      font-weight: 700;
      color: #0a487b;
    }
  }

  .inputs {
    width: 80%;
    margin: 0 auto 22px;
  }

  .sumbit {
    width: 200px;
    height: 36px;
    background: rgba(40, 130, 255, 1);
    box-shadow: 0px 7px 20px 0px rgba(40, 130, 255, 0.6);
    border-radius: 18px;
    line-height: 36px;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  .sumbit:hover {
    background: rgba(60, 165, 254, 1);
  }
}
</style>
