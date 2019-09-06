<template>
  <fragment>
    <template v-for="(item) in navList">
      <el-submenu :index="item.menuName" v-if="item.children.length" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title"  style="margin-left: 10px">{{item.menuName}}</span>
        </template>
        <menuContent :navList="item.children"></menuContent>
      </el-submenu>
      <el-menu-item :index="item.menuName" :class="{checked:paths === item.url}" :key="item.id"
                    v-if="item.disabled === 'true' ? item.url === navList[1].url : !item.children.length && item.menuName.indexOf('首页') ===  -1" @click="menuclick(item)">
        {{item.menuName}}
      </el-menu-item>
      <!-- <el-menu-item :index="item.menuName" :class="{checked:paths === item.url}" :key="item.id"
                    v-if="!item.children.length && item.menuName.indexOf('首页') ===  -1" @click="menuclick(item)">
        {{item.menuName}}
      </el-menu-item> -->
    </template>
  </fragment>
</template>

<script>
export default {
  name: 'menuContent',
  data () {
    return {
      menuId: null
    }
  },
  props: ['navList'],
  methods: {
    // 点击左侧菜单
    menuclick (breads) {
      this.$router.push(breads.url)
    }
  },
  computed: {
    paths () {
      return this.$store.state.checkPath
    }
  }
}
</script>
<style lang="scss" scoped>
  .checked {
    background: #4292ff;
    color: #fff;
  }
</style>
