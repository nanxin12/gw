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
import log from '@/assets/img/xtsz_logs.png'

export default {
  name: 'systemHome',
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
      let arr = this.$store.state.navTree.find(item => item.component === '/system/systemHome').children.slice(0)
      let obj = {}
      Object.assign(obj, this.$store.state.navTree.find(item => item.component === '/system/systemHome').children[0].children[0])
      obj.menuName = '用户列表'
      obj.disabled = 'true'
      arr.unshift(obj)
      return arr
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

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .cbcrContent {
        min-height: 700px;
        box-sizing: border-box;
        flex: 1;
        height: 100%;
        padding: 10px 20px 0;
      }
    }
  }
}
</style>
