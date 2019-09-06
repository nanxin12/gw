<template>
  <div class="cbcrTop">
    <div class="bread">
      <div class="breadLeft">
        <div class="tagssfather"
          ref="tagssfather"
          :key="index"
          v-for="(item,index) in this.$store.state.breadslist">
          <el-tag ref="breads"
            class="tagss"
            :class="{cheacked:paths === item.url}"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
            @click.native="goany(item.url)">
            {{item.menuName}}
          </el-tag>
        </div>
      </div>
      <div class="breadRight">
        <el-tag type="info"
          class="tagss"
          @click.native="deleteall()">
          清除导航({{num}})
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  methods: {
    // 删除顶部快捷菜单
    handleClose (index) {
      if (index === 0) {
      } else {
        this.$store.commit('deletebreadslist', index)
      }
    },
    // 点击快捷导航跳转
    goany (path) {
      this.$router.push(path)
    },
    // 清除所有面包屑
    deleteall () {
      this.$store.commit('deletebreadslist', 'clear')
    }
  },
  props: ['breadsOne'],
  mounted () {
    window.addEventListener('beforeunload', e => {
      sessionStorage.setItem('history', JSON.stringify(this.$store.state.breadslist))
    })
    if (sessionStorage.getItem('history')) {
      let arr = JSON.parse(sessionStorage.getItem('history'))
      arr.forEach(v => {
        if (v.url === this.$route.path) {
          this.$store.commit('savePath', v.url)
        }
        this.$store.commit('addbreadslist', v)
      })
    } else {
      this.$store.commit('addbreadslist', this.breadsOne[0])
      this.$store.commit('savePath', this.breadsOne[0].url)
    }
  },
  beforeDestroy () {
    this.$store.commit('deleteall', [])
    sessionStorage.removeItem('history')
    window.removeEventListener('beforeunload', e => {
      sessionStorage.setItem('history', JSON.stringify(this.$store.state.breadslist))
    })
  },
  computed: {
    paths () {
      return this.$store.state.checkPath
    },
    num () {
      return this.$store.state.breadslist.length
    }
  },
  watch: {
    '$route' (to) {
      this.$store.commit('savePath', to.path)
      let data = this.$store.state.breadslist.find(v => v.menuName === to.name)
      if (!data) {
        let father = document.getElementsByClassName('breadLeft')[0]
        let song = document.getElementsByClassName('tagssfather')[this.$store.state.breadslist.length - 1]
        if (song) {
          if ((father.offsetLeft + father.offsetWidth) <= ((song.offsetLeft + song.offsetWidth) + 116)) {
            this.$store.commit('deletebreadslist', 1)
          }
        }
        this.$store.commit('addbreadslist', { menuName: to.name, url: to.path })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cbcrTop {
  .bread {
    height: 42px;
    padding: 10px 20px 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;

    .breadLeft {
      height: 32px;
      display: flex;
      width: 94%;
      overflow: hidden;

      .tagssfather {
        padding: 0 3px;

        .tagss {
          cursor: pointer;
          background: #fff;
        }
      }
    }

    .breadRight {
      width: 6%;
      height: 32px;
      text-align: center;

      .tagss {
        cursor: pointer;
      }
    }
  }
}

/deep/ .cheacked {
  background: #4292ff !important;
  color: #fff !important;

  i {
    color: #fff !important;
  }
}
</style>
