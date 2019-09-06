<template>
  <div class="box">
    <Titles txt="维修上报信息"></Titles>
    <Forms type="REPAIR"></Forms>
  </div>
</template>

<script>
import Titles from '@/components/maintain/Titles'
import Forms from '@/components/maintain/Forms'
export default {
  name: 'maintain',
  components: {
    Titles,
    Forms
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    border-radius:4px;
  }
</style>
