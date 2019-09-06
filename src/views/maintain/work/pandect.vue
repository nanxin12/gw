<template>
  <div class="box">
    <div class="tableBox" v-if="other">
      <div class="boxHeader">
        <div class="top">
          <el-form :inline="true" :model="formInline">
            <el-form-item label="处理环节:">
              <el-select v-model="formInline.handleLink" placeholder="请选择" style="width: 190px">
                <el-option label="分派" value="CREATED"></el-option>
                <el-option label="处理" value="ASSIGNED"></el-option>
                <el-option label="采购" value="RECIVED"></el-option>
                <el-option label="关单审核" value="ACCEPTED"></el-option>
                <el-option label="已结束" value="CLOSE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上报部门:">
              <el-select v-model="formInline.departmentId" placeholder="请选择" style="width: 190px">
                <el-option :label="item.postName" :value="item.id" v-for="(item, index) in sectionList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上报时间:">
              <el-date-picker
                value-format="timestamp"
                @change="dayCheck"
                v-model="days"
                style="width: 360px;"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="initData('query')">查找</el-button>
              <el-button type="primary" @click="reset">重置</el-button>
              <el-button type="primary" @click="onSubmit">导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="boxs">
        <div class="boxContents">
          <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor" @selection-change="handleSelectionChange">
            <el-table-column label="序号" align="center" width="50">
              <template slot-scope="scope">
                <span>{{(formInline.pageNum-1)*formInline.pageSize+scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eventCode" label="事件编号" align="center"></el-table-column>
            <el-table-column prop="workSheetCode" label="工单编号" align="center"></el-table-column>
            <el-table-column label="处理环节" align="center">
              <template slot-scope="scope">
                <span style="font-size: 14px;color: #FFC333;font-weight: 700;" v-if="scope.row.handleLink === 'CREATED'">分派</span>
                <span style="font-size: 14px;color: #39BF3F;font-weight: 700;" v-if="scope.row.handleLink === 'ASSIGNED'">处理</span>
                <span style="font-size: 14px;color: #4292FF;font-weight: 700;" v-if="scope.row.handleLink === 'RECIVED'">采购</span>
                <span style="font-size: 14px;color: #FF7458;font-weight: 700;" v-if="scope.row.handleLink === 'ACCEPTED'">关单审核</span>
                <span style="font-size: 14px;color: #A5A5A5;font-weight: 700;" v-if="scope.row.handleLink === 'CLOSE'">已结束</span>
              </template>
            </el-table-column>
            <el-table-column prop="peopleName" label="上报人" align="center" width="78"></el-table-column>
            <el-table-column prop="departmentName" label="上报部门" align="center"></el-table-column>
            <el-table-column prop="headleDate"  :formatter='formatter' label="承办时间" align="center"></el-table-column>
            <el-table-column prop="createTime" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain round @click="handle(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
                  <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="formInline.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="formInline.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="formInline.eltotalCount">
        </el-pagination>
        </div>
      </div>
    </div>
    <div class="subBox" v-if="!other">
      <div class="sbTitle">
        <div class="content">
          <i class="el-icon-arrow-left" @click="goBack"></i>
          <p>工单办理</p>
        </div>
        <div class="step">
          <div class="stepContent" v-for="(item, index) in stepList" :key="index">
            <p :class="{bor:stepIndex >= index,bg:stepIndex === index}">
              <span v-if="index >= stepIndex" :class="{col:stepIndex === index}">{{index+1}}</span>
              <i v-else class="el-icon-check"></i>
            </p>
            <em>{{item.title}}</em>
            <div class="twig">
              <span :class="{bg:stepIndex > index}"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="sbContent">
        <Titles txt="上报信息"></Titles>
        <Forms :ruleForm="ruleForm.workReportInfo" :type="eventType" :station="false"></Forms>
        <Titles txt="基本信息"></Titles>
        <el-form :model="ruleForm" label-width="110px" class="demo-ruleForm">
          <el-row :gutter="110">
            <el-col :span="8">
              <el-form-item label="工单编号:">
                <el-input v-model="ruleForm.workBasicInfo.workSheetCode" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事件编号:">
                <el-input v-model="ruleForm.workBasicInfo.eventCode" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事件类型:">
                <el-input v-model="ruleForm.workBasicInfo.type" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="110">
            <el-col :span="8">
              <el-form-item label="处理站点:">
                <el-input v-model="ruleForm.workBasicInfo.handleSiteName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新时间:">
                <el-date-picker type="datetime" readonly v-model="ruleForm.workBasicInfo.updateDate" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="事件状态:">
                <el-input v-model="ruleForm.workBasicInfo.status" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="110">
            <el-col :span="8">
              <el-form-item label="处理紧急程度:">
                <el-input v-model="ruleForm.workBasicInfo.handleUrgentDegree" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="position: relative">
              <el-form-item label="处理时限:">
                <el-input v-model="ruleForm.workBasicInfo.handleSize" readonly></el-input>
                <span style="position: absolute;right: -56px;top: 0;">（小时）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="处理建议:">
            <el-input v-model="ruleForm.workBasicInfo.proposalMethod" readonly></el-input>
          </el-form-item>
        </el-form>
        <div v-if="!disposeShow">
          <Titles txt="反馈信息"></Titles>
          <el-form :model="saveForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="现场照片:" v-show="imgList.length">
              <div class="upBox">
                <div class="upDiv">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="imgBox" v-for="(item, index) in imgList" :key="index">
                  <div class="imgShade">
                    <i class="el-icon-zoom-in" @click="imgBig(item)"></i>
                  </div>
                  <img :src="item" alt="">
                </div>
              </div>
            </el-form-item>
            <el-form-item label="现场描述:" prop="sceneDesc">
              <el-input title="" type="textarea" v-model="saveForm.sceneDesc" :rows="4" readonly></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-bottom: 22px" v-show="shopData.length">
          <Titles txt="物资申请信息"></Titles>
          <table>
            <tr>
              <th>序号</th>
              <th>申请单号</th>
              <th>申请人</th>
              <th>当前状态</th>
              <th>申请数量</th>
              <th>单位</th>
              <th>产品名称</th>
              <th>产品规格</th>
            </tr>
            <tr v-for="(item, index) in shopData" :key="item.id">
              <td>{{index + 1}}</td>
              <td>{{item.applicatNum}}</td>
              <td>{{item.applicatPeople}}</td>
              <td>{{item.applicatState}}</td>
              <td>{{item.applicatToalNum}}</td>
              <td>{{item.productCompany}}</td>
              <td>{{item.productName}}</td>
              <td>{{item.productspec}}</td>
            </tr>
          </table>
        </div>
        <el-row style="padding-left: 80px">
          <el-button @click="goBack">返回</el-button>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="图片详情">
      <div style="display: flex;justify-content: center;">
        <img width="80%" height="80%" :src="showImg" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import Titles from '@/components/maintain/Titles'
import Forms from '@/components/maintain/EventDetails'
export default {
  name: 'pandect',
  components: {
    Titles,
    Forms
  },
  data () {
    return {
      eventType: null,
      handleLinks: null,
      closeBtn: false,
      disposeShow: false,
      saveForm: {
        createDate: null,
        id: null,
        lastUpdateDate: null,
        sceneDesc: null,
        sceneImgs: [],
        workSheetId: null
      },
      shopData: [],
      workSheetId: null,
      feedback: false,
      showImg: null,
      imgList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {},
      sectionList: [],
      stepIndex: null,
      other: true,
      stepList: [],
      days: [],
      formInline: {
        startDate: null,
        endDate: null,
        handleLink: null,
        departmentId: null,
        eltotalCount: 0,
        pageSize: 10,
        pageNum: 1
      },
      tableData: []
    }
  },
  created () {
    this.initData()
    this.initTree()
  },
  methods: {
    imgBig (val) {
      this.dialogVisible = true
      this.showImg = val
    },
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000 })
      else return '暂无数据'
    },
    traverseTree (tree) {
      tree.forEach(item => {
        if (Object.is(item.level, 1) && !item.hasOwnProperty('children')) this.sectionList.push({ postName: item.postName, id: item.id })
        if (item.hasOwnProperty('children')) this.traverseTree(item.children)
      })
    },
    async initTree () {
      let res = await this.$api.userList.getPostTreeList()
      if (Object.is(res.code, 200)) this.traverseTree(res.data)
      else this.$message.error('部门列表获取失败')
    },
    reset () {
      this.formInline.pageNum = 1
      this.formInline.handleLink = null
      this.formInline.departmentId = null
      this.formInline.endDate = null
      this.formInline.startDate = null
      this.days = []
      this.initData()
    },
    dayCheck (val) {
      if (val) {
        this.formInline.startDate = parseInt(val[0] / 1000)
        this.formInline.endDate = parseInt(val[1] / 1000)
      } else {
        this.formInline.startDate = null
        this.formInline.endDate = null
      }
    },
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let res = await this.$api.maintain.getPandectWorkList(this.formInline)
      if (Object.is(res.code, 200)) {
        this.tableData = res.data.list
        this.formInline.eltotalCount = res.data.total
      } else this.$message.error('工单数据获取失败')
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    onSubmit () {
      console.log('submit!')
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.formInline.pageSize = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.formInline.pageNum = values
      this.initData()
    },
    handleSelectionChange (data) {

    },
    async handle ({ workSheetId, handleLink }) {
      this.workSheetId = workSheetId
      this.handleLinks = handleLink
      if (Object.is(handleLink, 'CREATED')) this.disposeShow = true
      else this.disposeShow = false
      if (Object.is(handleLink, 'ASSIGNED') || Object.is(handleLink, 'RECIVED')) this.feedback = true
      else this.feedback = false
      if (Object.is(handleLink, 'ACCEPTED')) this.closeBtn = true
      else this.closeBtn = false
      let res = await this.$api.maintain.getWorkDetails(workSheetId)
      this.imgList = []
      for (let key in this.saveForm) {
        this.saveForm[key] = null
      }
      if (res.data.hasOwnProperty('workFeedbackInfo')) {
        if (res.data.workFeedbackInfo.hasOwnProperty('sceneImgs')) {
          this.imgList = res.data.workFeedbackInfo.sceneImgs.split(',')
        } else this.imgList = []
        this.saveForm.id = res.data.workFeedbackInfo.workFeedbackId
        this.saveForm.sceneDesc = res.data.workFeedbackInfo.sceneDesc
      }
      if (Object.is(res.code, 200)) {
        this.ruleForm = res.data
        switch (this.ruleForm.workBasicInfo.status) {
          case 'WAIT':
            this.ruleForm.workBasicInfo.status = '待处理'
            break
          case 'PROCESSING':
            this.ruleForm.workBasicInfo.status = '处理中'
            break
          case 'INVALID':
            this.ruleForm.workBasicInfo.status = '无效'
            break
          case 'CLOSE':
            this.ruleForm.workBasicInfo.status = '已处理'
            break
        }
        this.ruleForm.workReportInfo.reportDate *= 1000
        if (!this.ruleForm.workBasicInfo.updateDate) this.ruleForm.workBasicInfo.updateDate = null
        else this.ruleForm.workBasicInfo.updateDate *= 1000
        this.eventType = this.ruleForm.workBasicInfo.type
        if (Object.is(this.ruleForm.workBasicInfo.type, 'REPAIR')) this.ruleForm.workBasicInfo.type = '维修'
        else this.ruleForm.workBasicInfo.type = '漏点'
        this.other = false
        let ress = await this.$api.maintain.getShopMsg(workSheetId)
        if (ress.code === 200) {
          this.shopData = ress.data
        } else this.$message.error('申请列表获取失败')
      } else this.$message.error('工单详情获取失败')
    },
    goBack () {
      this.other = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .boxs {
    position: relative;
    width: 100%;
    .boxContents {
      width: 100%;
      border-radius: 5px;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      position: absolute;
      .tables{
        margin-bottom: 20px;
      }
    }
  }
  table{
    width: 83.3%;
    margin: 0 auto;
    th{
      background: #dae9ff;
      height: 48px;
      border-color: #dae9ff;
    }
    td{
      text-align: center;
      background: #FAFAFA;
      border-collapse: separate;
      border: 1px solid #EBEEF5;
      height: 48px;
    }
  }
  .box{
    width: 100%;
    height: 100%;
    .tableBox{
      .boxHeader{
        padding: 15px;
        .el-form-item{
          margin: 0 30px 15px 0;
        }
      }
      .boxContent{
        min-height: 593px;
        .content{
          border-radius: 10px;
          background: #fff;
          padding: 20px;
          margin-bottom: 30px;
        }
      }
    }
    .subBox{
      width: 100%;
      height: 100%;
      .sbTitle{
        width: 100%;
        height: 50px;
        background: #fff;
        border-radius:4px;
        display: flex;
        margin-bottom: 14px;
        .content{
          display: flex;
          align-items: center;
          margin-right: 70px;
          i{
            font-size: 30px;
            color: #4292FF;
            font-weight: 700;
            margin-right: 20px;
            cursor: pointer;
          }
          p{
            font-size: 20px;
            color: #4B4B4B;
          }
        }
        .step{
          flex: 1;
          display: flex;
          .stepContent{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            p{
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 2px solid #C0C0C0;
              color: #C0C0C0;
              display: flex;
              justify-content: center;
              align-items: center;
              box-sizing: border-box;
              i{
                color: #4292FF;
                font-size: 20px;
              }
            }
            em{
              color: #4B4B4B;
              margin: 0 10px;
            }
            .twig{
              flex: 1;
              display: flex;
              align-items: center;
              span{
                width: 95%;
                height: 2px;
                background: #C0C0C0;
                border-radius: 1px;
              }
            }
          }
          .stepContent:nth-last-child(1){
            .twig{
              display: none;
            }
          }
        }
      }
      .sbContent{
        border-radius: 4px;
        background: #fff;
        padding: 17px 0 46px 0;
      }
      .demo-ruleForm{
        padding: 0 20% 0 1.8%;
      }
      .upBox{
        display: flex;
        flex-wrap: wrap;
        position: relative;
        .upImg{
          cursor: pointer;
          width: 140px;
          height: 140px;
          opacity: 0;
          z-index: 1;
          margin-right: 10px;
        }
        .upDiv{
          width: 140px;
          height: 140px;
          position: absolute;
          left: 0;
          top: 0;
          box-sizing: border-box;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          i{
            font-size: 28px;
            color: #8c939d;
          }
        }
        .imgBox{
          width: 140px;
          height: 140px;
          margin: 0 10px 10px 0;
          position: relative;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          .imgShade{
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            position: absolute;
            border-radius: 6px;
            left: 0;
            top: 0;
            background: rgba(0,0,0,.5);
            transition: opacity .3s;
            i{
              font-size: 18px;
              color: #fff;
              margin: 0 10px;
            }
          }
          img{
            border-radius: 6px;
            width: 100%;
            height: 100%;
          }
        }
        .imgBox:hover .imgShade{
          opacity: 1;
        }
      }
    }
  }
  .bor{
    border-color: #4292FF!important;
  }
  .col{
    color: #fff!important;
  }
  .bg{
    background: #4292FF!important;
  }
</style>
