<template>
  <div class="chargehomeBox">
    <headers :titles=titles></headers>
    <div class="cbContent">
      <menuview :menulist=menuList></menuview>
      <div class="cbcRight" :class="{positionBox:digShow}">
        <div class="digBox" v-show="digShow" @click="closeDig"></div>
        <breads :breadsOne='menuList'></breads>
        <el-scrollbar style="height: 100%">
          <div class="cbcrContent">
            <router-view></router-view>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import headers from '@/components/Header'
import menuview from '@/components/Menu'
import breads from '@/components/Bread'
import log from '@/assets/img/scgl_logs.png'

export default {
  name: 'productionhome',
  components: {
    headers,
    menuview,
    breads
  },
  data () {
    return {
      titles: log
    }
  },
  methods: {
    closeDig () {
      this.$store.commit('changeDigShow', false)
    }
  },
  computed: {
    menuList () {
      return this.$store.state.navTree.find(item => item.component === '/Production/productionhome').children
    },
    digShow () {
      return this.$store.state.digShow
    }
  }
}
</script>
<style lang="scss" scoped>
  .chargehomeBox {
    height: 100%;
    display: flex;
    flex-direction: column;

    .cbContent {
      flex: 1;
      overflow: hidden;
      display: flex;
      background: rgba(231, 238, 255, 1);

      .cbcRight {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        .digBox {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          z-index: 998;
          background: rgba(0,0,0,.6);
        }

        /deep/ .el-scrollbar__wrap {
          overflow-x: hidden;
        }

        .cbcrContent {
          box-sizing: border-box;
          flex: 1;
          height: 100%;
          padding: 10px 20px 0;
        }
      }
      .positionBox {
        position: relative;
      }
    }
  }
</style>
