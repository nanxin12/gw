<template>
  <div class="chargehomeBox">
    <headers :titles=titles></headers>
    <div class="cbContent">
      <menuview :menulist=menuList></menuview>
      <div class="cbcRight">
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
import log from '@/assets/img/ysxt_logs.png'

export default {
  name: 'chargehome',
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
  computed: {
    menuList () {
      return this.$store.state.navTree.find(item => item.component === '/charge/chargehome').children
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
      display: flex;
      overflow-x: hidden;
      background: rgba(231, 238, 255, 1);

      .cbcRight {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;

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
    }
  }
</style>
