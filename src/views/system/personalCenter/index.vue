<template>
  <!-- 组织列表 -->
  <div class="inner">
    <div class="leftBox">
      <div class="leftTop">
        <div class="boxWrap">
          <div class="boxImg">
            <img src="@/assets/img/info_head.png"
              alt="">
          </div>
        </div>
        <div class="info">
          <span class="lable">{{this.userInfo.name}}</span>
          <span class="lable">岗位职责</span>
        </div>
        <!-- <div @click="initData">123</div> -->
      </div>
      <div class="leftBottom">
        <div class="leftBottomTop">
          <div class="left">
            <div class="info">
              <img src="@/assets/img/info_info.png"
                alt="">
            </div>
            <span>消息通知</span>
          </div>
          <div class="right">
            <div class="imgBox"
              @click="handleChangeReadAll">
              <img src="@/assets/img/info_sign.png"
                alt="">
              <div class="tips">
                {{this.unRead}}
              </div>
            </div>
            <div class="imgBox"
              @click="handleDeletes">
              <img src="@/assets/img/info_deletes.png"
                alt="">
              <div class="tips">
                {{this.total}}
              </div>
            </div>
          </div>
        </div>
        <el-scrollbar style="height:100%">
          <div class="leftBottomBottom"
            :infinite-scroll-disabled="disabled"
            v-infinite-scroll="load">
            <div class="box"
              v-for="(item, index) in this.datas"
              :key="index">
              <p class="p">{{item.content}}</p>
              <p class="p"
                v-if="item.type === 'APPROVAL'">
                <span>流水号：</span>
                <span>{{item.singleCode}}</span>
              </p>
              <p class="p"
                v-if="item.type === 'APPLY'">
                <span>申请单号：</span>
                <span>{{item.singleCode}}</span>
              </p>
              <p class="p"
                v-if="item.type === 'APPROVAL'">
                <span>审批人：</span>
                <span class="span">职员一</span>
                <span>职位：</span>
                <span>这是职位</span>
              </p>
              <div class="bottom">
                <div class="bottomLeft">
                  <div v-if="item.status === 'UNREAD'"
                    style="display: flex;">
                    <div class="state">未读</div>
                    <div style="margin-right:16px; cursor: pointer;"
                      @click="handleChangeRead(item.id)">
                      <img src="@/assets/img/info_unread.png"
                        alt="">
                    </div>
                  </div>
                  <div v-if="item.status === 'ALREADYREAD'"
                    style="display: flex;">
                    <div class="states">已读</div>
                    <div style="margin-right:16px;">
                      <img src="@/assets/img/info_read.png"
                        alt="">
                    </div>
                    <div @click="handleDelete(item.id)"
                      style="cursor: pointer;">
                      <img src="@/assets/img/info_delete.png"
                        alt="">
                    </div>
                  </div>
                </div>
                <div class="time">{{item.createTime}}</div>
              </div>
            </div>
          </div>
          <p v-if="loading"
            style="text-align:center;margin-bottom:30px;">加载中...</p>
          <p v-if="noMore"
            style="text-align:center;margin-bottom:30px;">没有更多了</p>
          <!-- <ul class="infinite-list" v-infinite-scroll="load">
            <li v-for="i in count" class="infinite-list-item">{{ i }}</li>
          </ul> -->
        </el-scrollbar>
      </div>
    </div>
    <div class="rightBox">
      <div class="rightContent">
        <div class="rightTop">
          <div @click="tabs(true)"
            class="rightTitle"
            :class="{'titles': this.state === true}">物资申请</div>
          <div @click="tabs(false)"
            class="rightTitle"
            :class="{'titles': this.state === false}">采购申请</div>
        </div>
        <div class="colors"
          :class="{'clickColors': this.state === false}"></div>
      </div>
      <div class="rightBottom">
        <!-- <el-scrollbar style="height:100%"> -->
        <div v-if="this.state === true">
          <material></material>
        </div>
        <div v-if="this.state === false">
          <purchase></purchase>
        </div>
        <!-- </el-scrollbar> -->
      </div>
    </div>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import material from './components/material'
import purchase from './components/purchase'
export default {
  name: 'index',
  data () {
    return {
      items: [0, 1, 2, 3, 4],
      state: true,
      datas: [],
      count: 2,
      unRead: '',
      loading: false,
      total: '',
      fa: true,
      userInfo: {}
    }
  },
  components: {
    material,
    purchase
  },
  computed: {
    noMore () {
      return this.count >= this.total
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    tabs (val) {
      this.state = val
    },
    load () {
      if (this.fa) {
        this.fa = false
        this.loading = true
        setTimeout(() => {
          this.count += 2
          this.$api.personalCenter.getMessageList({ pageNum: 1, pageSize: this.count, userId: this.userInfo.id }).then(res => {
            if (res.code === 200) {
              this.loading = false
              this.datas = res.data.list
              this.datas.forEach(v => {
                v.createTime = setTime({ date: v.createTime, number: 1000 })
              })
              this.total = res.data.total
              setTimeout(() => {
                this.fa = true
              }, 1000)
            } else {
              this.$message.error(res.msg)
            }
          })
        }, 2000)
      }
    },
    initData () {
      this.$api.personalCenter.getMessageList({ pageNum: 1, pageSize: this.count, userId: this.userInfo.id }).then(res => {
        if (res.code === 200) {
          this.datas = res.data.list
          this.datas.forEach(v => {
            v.createTime = setTime({ date: v.createTime, number: 1000 })
          })
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      this.$api.personalCenter.getMessageCount().then(res => {
        if (res.code === 200) {
          this.unRead = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDelete (val) {
      this.$api.personalCenter.deleteMessageByIds({ ids: val }).then(res => {
        if (res.code === 200) {
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleDeletes (val) {
      this.$api.personalCenter.deleteMessage().then(res => {
        if (res.code === 200) {
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleChangeRead (val) {
      this.$api.personalCenter.updateMessageByIds({ ids: val }).then(res => {
        if (res.code === 200) {
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleChangeReadAll () {
      this.$api.personalCenter.updateMessage().then(res => {
        if (res.code === 200) {
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  mounted () {
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userMsg'))
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  box-sizing: border-box;
  height: 100%;
  // padding-bottom: 35px;
  padding-bottom: 20px;
}
.leftBox {
  height: 100%;
  width: 450px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
}
.rightBox {
  height: 100%;
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  .rightContent {
    border-bottom: 1px solid rgba(66, 66, 66, 0.1);
    padding: 20px 0 18px 16px;
    position: relative;
    .rightTop {
      font-size: 16px;
      display: flex;
      .rightTitle {
        width: 100px;
        text-align: center;
        cursor: pointer;
      }
    }
    .rightTop > :first-child {
      margin-right: 20px;
    }
    .colors {
      background: #4292ff;
      position: absolute;
      width: 100px;
      height: 2px;
      left: 16px;
      bottom: -1px;
      transition: all 0.3s ease;
    }
    .clickColors {
      left: 136px;
    }
    .titles {
      color: #4292ff;
    }
  }
  .rightBottom {
    flex: 1;
  }
}
.leftTop {
  height: 223px;
  width: 100%;
  background: #fff;
  margin-bottom: 21px;
  display: flex;
  // justify-content: center;
  flex-direction: column;
  .boxWrap {
    margin-top: 27px;
    display: flex;
    justify-content: center;
    .boxImg {
      width: 104px;
      height: 104px;
    }
  }
  .info {
    margin-top: 27px;
    display: flex;
    justify-content: center;
    .lable {
      font-size: 16px;
    }
  }
  .info > :first-child {
    margin-right: 34px;
  }
}
.leftBottom {
  flex: 1;
  background: #fff;
  // background: green;
  display: flex;
  flex-direction: column;
  .leftBottomTop {
    width: 100%;
    box-sizing: border-box;
    padding: 0 23px 0 20px;
    background: #fff;
    height: 30px;
    margin-top: 13px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 17px;
    .left {
      display: flex;
      font-size: 16px;
      line-height: 30px;
      .info {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        margin-top: 2px;
      }
    }
    .right {
      display: flex;
      margin-right: 10px;
      .imgBox {
        width: 30px;
        height: 30px;
        position: relative;
        cursor: pointer;
        .tips {
          position: absolute;
          top: -10px;
          left: 13px;
          // right: -19px;
          // min-width: 20px;
          border-radius: 7px;
          background: rgba(254, 117, 123, 1);
          color: rgba(254, 254, 254, 1);
          padding: 0 4px;
          text-align: center;
          font-size: 12px;
          max-width: 33px;
          min-width: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .right > :first-child {
      margin-right: 30px;
    }
  }
  .leftBottomBottom {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0 30px;
    background: #fff;
    .box {
      border-bottom: 1px solid rgba(66, 66, 66, 0.1);
      margin-bottom: 30px;
      .p {
        line-height: 100%;
        font-size: 14px;
        margin-bottom: 11px;
        .span {
          margin-right: 15px;
        }
      }
      .bottom {
        display: flex;
        margin-bottom: 10px;
        justify-content: space-between;
        .bottomLeft {
          display: flex;
          .state {
            width: 36px;
            height: 16px;
            background: rgba(255, 0, 0, 0.1);
            border-radius: 8px;
            color: #ff0000;
            text-align: center;
            font-size: 12px;
            line-height: 16px;
            margin-right: 16px;
          }
        }
        .time {
          font-size: 12px;
          color: rgba(127, 127, 127, 1);
        }
      }
    }
  }
}
.box {
  position: relative;
  width: 100%;
  .boxContent {
    width: 100%;
    border-radius: 5px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    position: absolute;
    .tables {
      margin-bottom: 20px;
    }
  }
}
.states {
  width: 36px;
  height: 16px;
  background: rgba(24, 206, 84, 0.1);
  border-radius: 8px;
  color: #18ce54;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  margin-right: 16px;
}
.inner /deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
