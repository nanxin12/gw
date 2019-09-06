<template>
  <div class="dataBox">
    <div class="dataContent">
      <div class="leftBtn">
        <el-button icon="el-icon-caret-left" circle @click="last"></el-button>
      </div>
      <keep-alive>
        <component :is="view" class="contentView"></component>
      </keep-alive>
      <div class="rightBtn">
        <el-button icon="el-icon-caret-right" circle @click="next"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import payType from '@/components/Data/payType'
import dayWater from '@/components/Data/dayWater'
import monthWater from '@/components/Data/monthWater'

export default {
  name: 'Data',
  data () {
    return {
      classindex: 1,
      view: dayWater,
      oneCharsView: dayWater,
      twoCharsView: monthWater,
      threeCharsView: payType
    }
  },
  methods: {
    // 点击下一页
    next () {
      if (this.classindex === 3) this.classindex = 1
      else this.classindex++
      this.checkview()
    },
    // 点击上一页
    last () {
      if (this.classindex === 1) this.classindex = 3
      else this.classindex--
      this.checkview()
    },
    // 动态切换组件
    checkview () {
      switch (this.classindex) {
        case 1:
          this.view = this.oneCharsView
          break
        case 2:
          this.view = this.twoCharsView
          break
        case 3:
          this.view = this.threeCharsView
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dataBox {
    height: 100%;
    background: #fff;
    border-radius: 4px;
    .dataContent {
      position: relative;
      display: flex;
      justify-content: space-between;

      .leftBtn {
        display: flex;
        align-items: center;
        padding-left: 20px;
      }

      .contentView {
        flex: 1;
      }

      .rightBtn {
        display: flex;
        align-items: center;
        padding-right: 20px;
      }
    }
  }
</style>
