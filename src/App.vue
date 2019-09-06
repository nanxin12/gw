<template>
  <div id="app"
    v-loading="status"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      socket: null,
      userId: null
    }
  },
  created () {
    let userMsg = JSON.parse(localStorage.getItem('userMsg'))
    if (userMsg) {
      if ((userMsg.time + 604800000) >= new Date().getTime()) {
        this.userId = userMsg.id
        this.initSoekct(userMsg.id)
      }
    }
  },
  mounted () {
    this.$on('message', (id) => {
      this.initSoekct(id)
    })
  },
  beforeDestroy () {
    this.overWebSocket()
  },
  computed: {
    status () {
      return this.$store.state.showLod
    }
  },
  methods: {
    initSoekct (id) {
      this.userId = id
      // this.socket = new WebSocket(`ws://192.168.1.189:6789/websocket?userId=${id}`)
      // this.socket = new WebSocket(`wss://192.168.1.189:6789/websocket?userId=${id}`)
      // this.socket = new WebSocket(`ws://192.168.1.189:6789/websocket?userId=${id}`)
      this.socket = new WebSocket(`wss://www.yzqwater.cn/websocket?userId=${id}`)
      // this.socket = new WebSocket(`wss://www.yzqwater.cn/websocket?userId=${id}`)
      this.socket.onmessage = this.websocketOnMsg
      this.socket.onerror = this.websocketOnError
      this.socket.onclose = this.websocketClose
    },
    websocketOnMsg (e) {
      let data = JSON.parse(e.data)
      data.data = JSON.parse(data.data)
      switch (data.messageType) {
        case 'ALARM':
          this.$store.commit('saveDpAlarm', data)
          this.$store.commit('saveDpBulletinBoard', data)
          break
        case 'SENSORDATA':
          this.$store.commit('savaFacilityData', data)
          break
        case 'EVENT':
          this.$store.commit('saveDpBulletinBoard', data)
          break
        case 'HK_PICTURE':
          this.$store.commit('saveScMonitor', data)
          this.$store.commit('saveNewImg', data)
          this.$store.commit('saveDpAlarm', data)
          this.$store.commit('saveDpBulletinBoard', data)
          break
      }
      // if (data.messageType === 'ALARM' || data.messageType === 'EVENT') {
      //   this.$store.commit('saveDpBulletinBoard', data)
      // }
      // if (data.messageType === 'HK_PICTURE') {
      //   this.$store.commit('saveScMonitor', data)
      //   this.$store.commit('saveNewImg', data)
      // }
    },
    overWebSocket () {
      this.socket.close()
    },
    websocketOnError () {
      this.initSoekct(this.userId)
    },
    websocketClose () {
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
// 弹框和遮罩层的z-index
.v-modal {
  z-index: 101 !important;
}
#app /deep/ .el-dialog__wrapper {
  z-index: 102 !important;
}
</style>
