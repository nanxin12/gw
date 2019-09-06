<template>
    <div class="titlesBox">
      <span></span>
      <h3>{{txt}}</h3>
    </div>
</template>

<script>
export default {
  name: 'Titles',
  props: ['txt']
}
</script>

<style lang="scss" scoped>
  .titlesBox{
    padding: 8px 0;
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span{
      width:6px;
      height:40px;
      background:#4292FF;
      margin-right: 20px;
    }
    h3{
      font-size:18px;
      color: #4B4B4B;
    }
  }
</style>
