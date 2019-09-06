<template>
  <div class="homeBox">
    <div class="hbTop">
      <div class="hbtLeft">
        <img src="../assets/img/logo.png" alt="">
        <h2>原州区智慧水务监测平台</h2>
      </div>
      <div class="hbtRight">
        <img src="../assets/img/userImg.png" alt="">
        <div class="loginout">
          <p>{{userName}}</p>
          <div class="loginoutBox">
            <em></em>
            <span></span>
            <ul>
              <li @click="loginout">退出登录</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="hbContent">
      <div class="menuBox">
        <ul>
          <li @click="goUrl(item.url)" v-for="item in menuList" :key="item.id">
            <img :src="diaodu" v-show="item.icon === '1'" alt="">
            <img :src="yingshou" v-show="item.icon === '2'" alt="">
            <img :src="wuzi" v-show="item.icon === '3'" alt="">
            <img :src="yunwei" v-show="item.icon === '4'" alt="">
            <img :src="shengchan" v-show="item.icon === '5'" alt="">
            <img :src="shezhi" v-show="item.icon === '6'" alt="">
            <p>{{item.menuName}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import diaodu from '../assets/img/supplywater.png'
import yingshou from '../assets/img/charge.png'
import wuzi from '../assets/img/goods.png'
import yunwei from '../assets/img/maintenance.png'
import shengchan from '../assets/img/production.png'
import shezhi from '../assets/img/setting.png'
export default {
  name: 'home',
  data () {
    return {
      diaodu: diaodu,
      yingshou: yingshou,
      wuzi: wuzi,
      yunwei: yunwei,
      shengchan: shengchan,
      shezhi: shezhi,
      userName: JSON.parse(localStorage.getItem('userMsg')).name
    }
  },
  methods: {
    // 跳转页面
    goUrl (url) {
      this.$store.commit('deleteall', [])
      this.$router.push(url)
    },
    // 登出删除sessionStorage
    async loginout () {
      let res = await this.$api.home.loginOut()
      if (res.code === 200) {
        localStorage.clear()
        this.$parent.overWebSocket()
        this.$router.push('/login')
      } else this.$message.error('登出失败')
    }
  },
  computed: {
    menuList () {
      return this.$store.state.navTree
    }
  }
}
</script>

<style lang="scss" scoped>
  .homeBox {
    background: url("../assets/img/homebg.jpg");
    background-size: 100% 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .hbTop {
      height: 80px;
      display: flex;
      justify-content: space-between;

      .hbtLeft {
        display: flex;

        img {
          display: block;
          width: 150px;
          height: 80px;
        }

        h2 {
          font-size: 30px;
          color: #fff;
          height: 80px;
          line-height: 80px;
        }
      }

      .hbtRight {
        display: flex;
        align-items: center;
        padding-right: 40px;

        img {
          display: block;
          width: 24px;
          height: 24px;
          margin-right: 10px;
        }

        .loginout {
          position: relative;

          p {
            font-size: 20px;
            color: #ccc;
            cursor: pointer;
          }

          .loginoutBox {
            display: none;

            em {
              position: absolute;
              display: block;
              top: 22px;
              height: 20px;
              width: 76px;
              background: transparent;
              left: 50%;
              margin-left: -38px;
            }

            span {
              display: block;
              width: 0;
              height: 0;
              position: absolute;
              border: 8px solid transparent;
              border-bottom-color: #fff;
              left: 50%;
              top: 22px;
              margin-left: -8px;
            }

            ul {
              position: absolute;
              background: #fff;
              top: 38px;
              left: 50%;
              padding: 10px 0;
              border-radius: 5px;
              cursor: pointer;
              margin-left: -38px;

              li {
                white-space: nowrap;
                padding: 0 10px;
              }

              li:hover {
                background: #ff8900;
              }
            }
          }
        }

        .loginout:hover p {
          color: #fff;
        }

        .loginout:hover .loginoutBox {
          display: block;
        }
      }
    }

    .hbContent {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .menuBox {
        width: 100%;

        ul {
          padding: 0 10%;
          display: flex;
          flex-wrap: wrap;
          li {
            cursor: pointer;
            padding: 4% 0;
            width: 33.33%;
            transition: all .5s;

            img {
              display: block;
              margin: 0 auto;
              width: 142px;
              height: 142px;
            }

            p {
              text-align: center;
              font-size: 18px;
              color: #fff;
              margin: 3% 0;
            }
          }

          li:hover {
            transform: scale(1.15);
          }
        }
      }
    }
  }
</style>
