<template>
  <div>
    <div class="leftTopImg"></div>
    <div class="rightTopImg"></div>
    <div class="leftBottomImg"></div>
    <div class="rightBottomImg"></div>
    <div class="topCenter" v-if="!data"></div>
  </div>
</template>

<script>
export default {
  name: 'borderImg',
  data () {
    return {

    }
  },
  props: {
    data: {
      type: Boolean
    }
  },
  methods: {

  },
  created () {

  }
}
</script>

<style scoped>
.leftTopImg {
  position: absolute;
  left: -8px;
  top: -8px;
  width: 31px;
  height: 31px;
  background: url("../../assets/img/dp_fillet.png");
}
.rightTopImg {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 31px;
  height: 31px;
  background: url("../../assets/img/dp_fillet.png");
  transform: rotate(90deg);
}
.rightBottomImg {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 31px;
  height: 31px;
  background: url("../../assets/img/dp_fillet.png");
  transform: rotate(-180deg);
}
.leftBottomImg {
  position: absolute;
  left: -8px;
  bottom: -8px;
  width: 31px;
  height: 31px;
  background: url("../../assets/img/dp_fillet.png");
  transform: rotate(-90deg);
}
.topCenter {
  position: absolute;
  left: 50%;
  top: -3px;
  margin-left: -162px;
  width: 324px;
  height: 6px;
  background: url("../../assets/img/dp_guang.png");
}
</style>
