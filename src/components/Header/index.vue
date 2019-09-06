<template>
  <div class="cbTop">
    <div class="cbtLeft">
      <img :src="titles"
        alt=""
        srcset="">
      <!-- <el-button id="weituo" type="primary" :icon="icon" size="mini" @click="checkhs"
                 style="background:#fff;"></el-button> -->
      <div class="btn"
        @click="checkhs">
        <i id="btnIcon"
          :class="icon"></i>
      </div>
    </div>
    <ul class="cbtRight">
      <li>
        <iframe width="411"
          scrolling="no"
          height="60"
          frameborder="0"
          allowtransparency="true"
          src="https://i.tianqi.com/index.php?c=code&id=12&color=%23FFFFFF&icon=1&num=3&site=12"></iframe>
      </li>
      <li>{{times}}</li>
      <li class="userBox"
        @mouseenter="users = true"
        @mouseleave="users = false">
        <p>{{username}}</p>
        <div class="usersBox"
          v-show="users">
          <ul>
            <li @click="handleInfo">个人信息</li>
          </ul>
          <span></span>
          <p></p>
        </div>
      </li>
      <li @click="gohome">前台首页</li>
    </ul>
    <el-dialog :visible.sync="dialogVisible" style="z-index:100"
      top='20px'
      title="个人中心"
      width='85%'>
      <personalCenter v-if="dialogVisible"></personalCenter>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import personalCenter from '@/views/system/personalCenter'
export default {
  name: 'index',
  props: ['titles'],
  data () {
    return {
      username: JSON.parse(localStorage.getItem('userMsg')).name,
      times: '',
      users: false,
      icon: 'el-icon-s-fold',
      timing: null,
      dialogVisible: false
    }
  },
  components: {
    personalCenter
  },
  created () {
    this.timess()
  },
  methods: {
    // 切换左侧菜单宽度
    checkhs () {
      if (this.icon !== 'el-icon-s-fold') {
        this.icon = 'el-icon-s-fold'
        this.$store.commit('checkisCollapse', false)
      } else {
        this.icon = 'el-icon-s-unfold'
        this.$store.commit('checkisCollapse', true)
      }
    },
    // 显示实时时间
    timess () {
      this.times = setTime({})
      this.timing = setInterval(() => {
        this.times = setTime({})
      }, 1000)
    },
    // 跳转到主页
    gohome () {
      this.$router.push('/')
    },
    handleInfo () {
      this.dialogVisible = true
      // this.$store.commit('changeInfo', true)
    }
  },
  beforeDestroy () {
    window.clearInterval(this.timing)
  }
}
</script>

<style lang="scss" scoped>
.cbTop {
  height: 48px;
  width: 100%;
  background: #4292ff;
  display: flex;
  justify-content: space-between;

  .cbtLeft {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: 220px;
      height: 48px;
      display: block;
      border: none;
    }
    /deep/ i {
      font-size: 18px !important;
      color: #4292ff !important;
      font-weight: 700;
    }
  }

  .cbtRight {
    display: flex;
    height: 100%;
    align-items: center;
    padding-right: 50px;

    li {
      color: #fff;
      padding: 0 30px;
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .userBox {
      position: relative;

      .usersBox {
        ul {
          position: absolute;
          left: 50%;
          top: 56px;
          margin-left: -58px;
          background: #ccc;
          padding: 10px 0;
          border-radius: 5px;
          z-index: 10;

          li {
            color: #222222;
            height: 40px;
            line-height: 40px;
            text-align: center;
            white-space: nowrap;
          }

          li:hover {
            background: #5fb878;
            color: #fff;
          }
        }

        span {
          display: block;
          width: 0;
          height: 0;
          position: absolute;
          border: 8px solid transparent;
          border-bottom-color: #ccc;
          left: 50%;
          top: 40px;
          margin-left: -8px;
        }

        p {
          width: 116px;
          height: 8px;
          position: absolute;
          left: 50%;
          top: 48px;
          background: transparent;
          margin-left: -58px;
        }
      }
    }

    li:hover {
      background: url("../../assets/img/green.png") repeat-x left bottom;
    }
  }
}
.btn {
  height: 100%;
  width: 50px;
  background: #2c85ff;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
}
.btn:hover {
  background: #fff;
}
#btnIcon {
  color: #fff !important;
}
.btn:hover #btnIcon {
  color: #4292ff !important;
}
.cbTop /deep/ .el-dialog__body {
  height: 820px;
  padding: 25px 22px 10px !important;
}
.cbTop /deep/ .el-dialog__header {
  border-radius: 0;
  padding: 10px 20px 10px;
}
.cbTop /deep/ .el-dialog__headerbtn {
  top: 15px;
}
.cbTop /deep/.v-modal {
  z-index: 99;
}
</style>
