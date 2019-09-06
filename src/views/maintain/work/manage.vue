<template>
  <div class="box">
    <div class="tableBox" v-if="other">
      <div class="boxHeader">
        <div class="top">
          <el-form :inline="true" :model="formInline">
            <el-form-item label="处理环节:">
              <el-select v-model="formInline.handleLink" placeholder="请选择" style="width: 190px">
                <el-option label="分派" value="CREATED"></el-option>
                <el-option label="采购" value="RECIVED"></el-option>
                <el-option label="处理" value="ASSIGNED"></el-option>
                <el-option label="关单审核" value="ACCEPTED"></el-option>
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
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="boxs">
        <div class="boxContents">
          <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
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
                <span style="font-size: 14px;color: #4292FF;font-weight: 700;" v-if="scope.row.handleLink === 'RECIVED'">采购</span>
                <span style="font-size: 14px;color: #39BF3F;font-weight: 700;" v-if="scope.row.handleLink === 'ASSIGNED'">处理</span>
                <span style="font-size: 14px;color: #FF7458;font-weight: 700;" v-if="scope.row.handleLink === 'ACCEPTED'">关单审核</span>
              </template>
            </el-table-column>
            <el-table-column prop="peopleName" label="上报人" align="center" width="78"></el-table-column>
            <el-table-column prop="departmentName" label="上报部门" align="center"></el-table-column>
            <el-table-column prop="headleDate" :formatter='formatter' label="承办时间" align="center"></el-table-column>
            <el-table-column prop="createTime" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain round @click="handle(scope.row)">操作</el-button>
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
            <em>{{item}}</em>
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
          <el-form :model="saveForm" :rules="saveRules" ref="saveRef" label-width="110px" class="demo-ruleForm">
            <el-form-item label="现场照片:">
              <div class="upBox">
                <input title="点击上传或拖拽上传" class="upImg" type="file" name="files" multiple @change="upload($event)">
                <div class="upDiv">
                  <i class="el-icon-plus"></i>
                </div>
                <div class="imgBox" v-for="(item, index) in imgList" :key="index">
                  <div class="imgShade">
                    <i class="el-icon-zoom-in" @click="imgBig(item)"></i>
                    <i class="el-icon-delete" @click="imgDel(index)"></i>
                  </div>
                  <img :src="item" alt="">
                </div>
              </div>
            </el-form-item>
            <el-form-item label="现场描述:" prop="sceneDesc">
              <el-input title="" type="textarea" v-model="saveForm.sceneDesc" :rows="4" :readonly="handleLinks === 'ACCEPTED' || handleLinks === 'CLOSE'"></el-input>
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
          <el-button v-if="feedback" type="primary" @click="dispose">处理</el-button>
          <el-button v-if="disposeShow" type="primary" @click="assign">分派</el-button>
          <el-button v-if="feedback" type="primary" @click="applyFor">申请物资</el-button>
          <el-button v-if="closeBtn" type="primary" @click="closeWork">关闭工单</el-button>
          <el-button v-if="feedback" @click="save">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="图片详情">
      <div style="display: flex;justify-content: center;">
        <img width="80%" height="80%" :src="showImg" alt="">
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAssign" @close="closeDig('assignRef')" title="任务分派" width="30%">
      <el-form label-width="90px" ref="assignRef" :model="assignForm" :rules="assignRules">
        <el-form-item label="处理人员:" prop="handlePeopleId">
          <el-select v-model="assignForm.handlePeopleId " placeholder="请选择" @change="userChange" style="width: 100%">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in userList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交办意见:" prop="handleIdea">
          <el-input type="textarea" v-model="assignForm.handleIdea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="dialogAssign = false">取消</el-button>
          <el-button type="primary" @click="assignSubmit('assignRef')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
import Titles from '@/components/maintain/Titles'
import Forms from '@/components/maintain/EventDetails'
export default {
  name: 'manage',
  components: {
    Titles,
    Forms
  },
  data () {
    return {
      eventId: null,
      shopData: [],
      eventType: null,
      handleLinks: null,
      closeBtn: false,
      disposeShow: false,
      saveForm: {
        createDate: null,
        id: null,
        lastUpdateDate: null,
        sceneDesc: null,
        sceneImgs: null,
        workSheetId: null
      },
      saveRules: {
        sceneDesc: [{ required: true, message: '请输入现场描述', trigger: 'blur' }]
      },
      userList: [],
      workSheetId: null,
      assignForm: {
        handlePeopleId: null,
        handlePeopleName: null,
        handleIdea: null
      },
      assignRules: {
        handlePeopleId: [{ required: true, message: '请选择处理人员', trigger: 'change' }]
      },
      feedback: false,
      rules: {
        workBasicInfo: {
          departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
        }
      },
      showImg: null,
      imgList: [],
      dialogImageUrl: '',
      dialogAssign: false,
      dialogVisible: false,
      ruleForm: {},
      sectionList: [],
      treeList: [],
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
    closeDig (ref) {
      this.$refs[ref].resetFields()
    },
    closeWork () {
      this.$confirm('是否确认关闭工单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log(this.eventId, this.workSheetId)
        let res = await this.$api.maintain.workClose({ eventId: this.eventId, workSheetId: this.workSheetId })
        if (Object.is(res.code, 200)) {
          this.$message.success('关闭成功')
          this.other = true
          this.initData()
        } else this.$message.error('关闭失败')
      })
    },
    save () {
      this.$refs.saveRef.validate(async (valid) => {
        if (valid) {
          let time = parseInt(new Date().getTime() / 1000)
          this.saveForm.createDate = time
          this.saveForm.lastUpdateDate = time
          if (this.imgList.length) {
            this.saveForm.sceneImgs = this.imgList.join(',')
          }
          this.saveForm.workSheetId = this.workSheetId
          let res = await this.$api.maintain.workSave(this.saveForm)
          if (Object.is(res.code, 200)) {
            this.$message.success('工单保存成功')
            this.other = true
            this.initData()
          } else this.$message.error('工单保存失败')
        }
      })
    },
    userChange (val) {
      this.assignForm.handlePeopleName = this.userList.find(v => v.id === val).name
    },
    assignSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$api.maintain.workOut(this.workSheetId, this.assignForm)
          if (Object.is(res.code, 200)) {
            this.dialogAssign = false
            this.$message.success('工单分派成功')
            this.other = true
            this.initData()
          } else this.$message.error('工单分派失败')
        }
      })
    },
    assign () {
      this.dialogAssign = true
    },
    dispose () {
      this.$refs.saveRef.validate(async (valid) => {
        if (valid) {
          let time = parseInt(new Date().getTime() / 1000)
          this.saveForm.createDate = time
          this.saveForm.lastUpdateDate = time
          if (this.imgList.length) {
            this.saveForm.sceneImgs = this.imgList.join(',')
          }
          this.saveForm.workSheetId = this.workSheetId
          let res = await this.$api.maintain.workHandle(this.saveForm)
          if (res.code === 200) {
            this.$message.success('工单保存成功')
            this.other = true
            this.initData()
          } else this.$message.error('工单保存失败')
        }
      })
    },
    async applyFor () {
      let res = await this.$api.maintain.getShopCode({ workSheetId: this.workSheetId })
      if (res.code === 200) {
        this.$router.push({ path: '/goodshome/index' })
        setTimeout(() => {
          this.$router.push({ path: '/goodshome/receives', query: { shopId: res.data } })
        }, 100)
      } else this.$message.error('物资申请编号获取失败')
    },
    imgBig (val) {
      this.dialogVisible = true
      this.showImg = val
    },
    imgDel (index) {
      if (this.handleLinks === 'ACCEPTED' || this.handleLinks === 'CLOSE') this.$message.error('当前环节不能删除图片')
      else this.imgList.splice(index, 1)
    },
    async upload (e) {
      if (e.target.files.length > 0) {
        if (Object.is(this.handleLinks, 'ACCEPTED') || Object.is(this.handleLinks, 'CLOSE')) return this.$message.error('当前环节不能上图片')
        if (this.imgList.length < 7 && (this.imgList.length + e.target.files.length) < 7) {
          let form = new FormData()
          for (let i = 0; i < e.target.files.length; i++) {
            if ((e.target.files[i].size / (1024 * 1024)) > 20) return this.$message.error('上传图片大小不能超过20M')
            if (e.target.files[i].type === 'image/png' || e.target.files[i].type === 'image/jpeg') {
            } else return this.$message.error('上传图片必须是jpg或png格式')
            form.append('files', e.target.files[i])
          }
          let res = await this.$api.maintain.workUpload(form)
          if (Object.is(res.code, 200)) {
            this.$message.success('图片上传成功')
            res.data.forEach(item => {
              this.imgList.push(item)
            })
          } else this.$message.error('图片上传失败')
        } else this.$message.error('上传图片不能超过6张')
      }
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
      if (res.code === 200) this.traverseTree(res.data)
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
      let res = await this.$api.maintain.getWorkList(this.formInline)
      if (res.code === 200) {
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
    async handle ({ workSheetId, handleLink }) {
      this.workSheetId = workSheetId
      this.handleLinks = handleLink
      if (handleLink === 'CREATED') this.disposeShow = true
      else this.disposeShow = false
      if (handleLink === 'ASSIGNED' || handleLink === 'RECIVED') this.feedback = true
      else this.feedback = false
      if (handleLink === 'ACCEPTED') this.closeBtn = true
      else this.closeBtn = false
      let res = await this.$api.maintain.getWorkDetails(workSheetId)
      if (res.code === 200) {
        this.eventId = res.data.eventId
        this.userList = res.data.workBasicInfo.users
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
        if (this.ruleForm.workBasicInfo.type === 'REPAIR') this.ruleForm.workBasicInfo.type = '维修'
        else this.ruleForm.workBasicInfo.type = '漏点'
        this.other = false
      } else this.$message.error('工单详情获取失败')
      let ress = await this.$api.maintain.getShopMsg(workSheetId)
      if (ress.code === 200) {
        this.shopData = ress.data
        switch (handleLink) {
          case 'CREATED':
            this.stepList = ['分派', '处理', '关单审核']
            this.stepIndex = 0
            break
          case 'RECIVED':
            this.stepList = ['分派', '采购', '处理', '关单审核']
            this.stepIndex = 1
            break
          case 'ASSIGNED':
            if (this.shopData.length) {
              this.stepList = ['分派', '采购', '处理', '关单审核']
              this.stepIndex = 2
            } else {
              this.stepList = ['分派', '处理', '关单审核']
              this.stepIndex = 1
            }
            break
          case 'ACCEPTED':
            if (this.shopData.length) {
              this.stepList = ['分派', '采购', '处理', '关单审核']
              this.stepIndex = 3
            } else {
              this.stepList = ['分派', '处理', '关单审核']
              this.stepIndex = 2
            }
            break
        }
        this.shopData.forEach(item => {
          if (item.applicatState === '未提交' || item.applicatState === '待审核') {
            // eslint-disable-next-line no-return-assign
            return this.feedback = false
          }
        })
      } else this.$message.error('申请列表获取失败')
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
