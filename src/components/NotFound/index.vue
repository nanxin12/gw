<template>
  <div>
    <div class="imgBox">
      <img src="../../assets/img/404.png"
        alt="">
    </div>
    <div>
      <p class="p1">哎呀,您访问的页面不存在！</p>
      <p class="p2"
        @click="handleGoBack">返回上级页面</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {

    }
  },
  methods: {
    handleGoBack () {
      if (window.history.length <= 2) {
        this.$router.push('/')
      } else {
        this.$router.back(-1)
      }
    }
  },
  created () {

  }
}
</script>

<style scoped>
.imgBox {
  text-align: center;
}
.p1 {
  color: #15a3e3;
  font-size: 23px;
  text-align: center;
}
.p2 {
  margin-top: 10px;
  color: #0f9bd9;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}
</style>
