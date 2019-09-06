<template>
  <el-scrollbar class="box" :class="{openWidth:!Collapse,closeWidth:Collapse}">
    <el-menu :collapse-transition="false" class="cbcLeft" :collapse="Collapse" :unique-opened="true" v-bind:style="{width: `${menuWidth}`}">
      <NavList :navList="menulist"></NavList>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import NavList from './menuContent'
export default {
  name: 'index',
  props: ['menulist'],
  components: {
    NavList
  },
  computed: {
    /**
     * @return {boolean}
     */
    menuWidth () {
      if (!this.$store.state.isCollapse) return '220px'
      else return '60px'
    },
    Collapse () {
      return this.$store.state.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    background: #fff;
    transition: min-width .3s;
    height: 100%;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2);
  }
  .cbcLeft {
    height: 100%;
  }
  .openWidth {
    min-width: 220px;
  }
  .closeWidth {
    min-width: 60px;
  }
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
