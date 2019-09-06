<template>
  <div class="waterSupply">
    <div class="wsTop">
      <div class="wstLeft">
        <img src="../../assets/img/dp_logo.png"
          alt="">
        <span>供水信息系统</span>
      </div>
      <div class="wstRight">
        <div class="times">{{times}}</div>
        <img src="../../assets/img/exit.png"
          @click="goOut"
          alt="">
      </div>
    </div>
    <!-- <div class="btn">
      <ul>
        <li v-for="(item, index) in menuList"
          :key="index"
          :class="{btn_nav1:index === 0, btn_nav5:index === 0 ? false : indexs === index,  btn_nav4: index === 0 ? indexs !== index : false}"
          :style="{left: 118*index + 'px'}"
          @click="nextPath(item.url,index)">
          <span>{{item.menuName}}</span>
        </li>
      </ul>
    </div> -->
    <div class="wsContent">
      <div class="btn">
        <ul>
          <li v-for="(item, index) in menuList"
            :key="index"
            :class="{btn_nav1:index === 0, btn_nav5:index === 0 ? false : indexs === index,  btn_nav4: index === 0 ? indexs !== index : false}"
            :style="{left: 118*index + 'px'}"
            @click="nextPath(item.url,index)">
            <span>{{item.menuName}}</span>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'waterSupplyHome',
  data () {
    return {
      times: '',
      indexs: 0,
      timing: null
    }
  },
  created () {
    this.timess()
    if (sessionStorage.getItem('dp_nav') !== null) {
      this.indexs = Number(sessionStorage.getItem('dp_nav'))
      console.log(this.indexs)
    }
  },
  computed: {
    menuList () {
      return this.$store.state.navTree.find(item => item.component === '/waterSupply/waterSupplyHome').children
    }
  },
  methods: {
    // 跳转页面
    nextPath (path, index) {
      this.$router.push(path)
      this.indexs = index
      sessionStorage.setItem('dp_nav', index)
    },
    // 返回主菜单
    goOut () {
      this.$router.push('/')
    },
    // 显示实时时间
    timess () {
      this.times = setTime({ type: 4 })
      this.timing = setInterval(() => {
        this.times = setTime({ type: 4 })
      }, 1000)
    }
  },
  beforeDestroy () {
    window.clearInterval(this.timing)
    sessionStorage.removeItem('dp_nav')
    sessionStorage.removeItem('history')
  }
}
</script>

<style lang="scss" scoped>
.waterSupply {
  width: 100%;
  height: 100%;
  // background: url("../../assets/img/dp_bg.png");
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;

  .wsTop {
    // height: 80px;
    height: 6.4129%;
    width: 100%;
    display: flex;
    color: #abbbd4;
    background: rgba(16, 36, 66, 1);
    min-height: 62px;
    box-shadow: 0px 34px 40px 0px rgba(18, 56, 112, 1) inset;

    .wstLeft {
      flex: 1;
      display: flex;
      align-items: center;
      span {
        font-size: 22px;
      }
      img {
        width: 44px;
        height: 44px;
        margin-left: 35px;
        margin-right: 30px;
      }

      h3 {
        font-size: 22px;
        margin: 0 40px;
      }
    }

    .wstRight {
      display: flex;
      align-items: center;
      margin-right: 30px;

      .times {
        height: 25px;
        padding: 5px 10px;
        background: #000;
        line-height: 25px;
        border-radius: 3px;
        border: 1px solid rgba(38, 115, 230, 1);
        margin-right: 14px;
      }

      i {
        margin-right: 20px;
        font-size: 28px;
        font-weight: 700;
        cursor: pointer;
      }
      img {
        cursor: pointer;
      }
    }
  }
  .btn {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    top: 0.5208vw;
    // margin-top: 1.041vw;
    padding: 0 1.25vw;
    display: flex;
    // margin-bottom: 1.041vw;
    z-index: 999;
    ul {
      position: relative;
      flex: 1;
      border-bottom: 1px solid rgba(45, 115, 199, 1);
      height: 30px;
      width: 100%;
    }
    li {
      position: absolute;
      left: 0;
      top: 1;
      width: 134px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #ffffff;
      background: url("../../assets/img/dp_nav2.png");
      cursor: pointer;
    }
    .btn_nav1 {
      background: url("../../assets/img/dp_nav1.png");
    }
    .btn_nav2 {
      background: url("../../assets/img/dp_nav2.png");
    }
    .btn_nav4 {
      background: url("../../assets/img/dp_nav4.png");
    }
    .btn_nav5 {
      background: url("../../assets/img/dp_nav5.png");
    }
  }
  .wsContent {
    flex: 1;
    display: flex;
    // padding: 0 1.25vw 0.9895vw 1.25vw;
    // background: url("../../assets/img/dp_bg.png");
    position: relative;
  }
}
.lbg {
  background: #123c7e;
}
.pbg {
  background: #123c7e;
  box-shadow: 0px 0px 11px 1px rgb(48, 103, 189);
}
</style>
