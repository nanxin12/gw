<template>
    <div class="box">
      <ul class="stationBox">
        <li v-for="(item, index) in stationList" :class="{bgs: index === checked}" :key="item.id" v-show="item.typeName === '高位水池' || item.typeName === '水厂' || item.typeName === '泵站'">
          <p @click="changeImg(index)">{{item.name}}</p>
          <el-button type="primary" plain size="mini" round style="height: 30px">设备控制</el-button>
        </li>
      </ul>
      <div class="videoBox">
        <div>
          <img @click="errors" src="../../../assets/img/video.png" alt="">
          <p>{{stationName}}</p>
        </div>
        <div>
          <img @click="errors" src="../../../assets/img/video.png" alt="">
          <p>{{stationName}}</p>
        </div>
        <div>
          <img @click="errors" src="../../../assets/img/video.png" alt="">
          <p>{{stationName}}</p>
        </div>
        <div>
          <img @click="errors" src="../../../assets/img/video.png" alt="">
          <p>{{stationName}}</p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'oneWaterSupply',
  data () {
    return {
      stationList: [],
      imgList: [],
      checked: 0,
      stationName: null
    }
  },
  created () {
    this.initStation()
  },
  methods: {
    async initStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationList = res.data
        for (let i = 0; i < this.stationList.length; i++) {
          let item = this.stationList[i]
          if (item.typeName === '高位水池' || item.typeName === '水厂' || item.typeName === '泵站') {
            this.checked = i
            this.stationName = item.name
            break
          }
        }
      }
    },
    changeImg (i) {
      this.checked = i
      this.stationName = this.stationList[i].name
    },
    errors () {
      this.$message.error('视频数据暂未上传')
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    .stationBox{
      width: 280px;
      height: 100%;
      border: 1px solid #ccc;
      overflow-y: auto;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px 20px 0 0;
      li{
        width: 100%;
        height: 40px;
        text-indent: 20px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        border-left: 2px solid transparent;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .bgs{
        border-color: #4292FF!important;
      }
    }
    .videoBox{
      flex: 1;
      box-sizing: border-box;
      padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      img {
        width: 480px;
        height: 270px;
      }
      p{
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
</style>
