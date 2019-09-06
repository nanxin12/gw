<template>
    <div class="box">
      <div class="tableBox" v-show="other">
        <div class="boxHeader">
          <div class="top">
            <el-form :inline="true" :model="formInline">
              <el-form-item label="事件状态:">
                <el-select v-model="formInline.status" placeholder="请选择" style="width: 190px">
                  <el-option label="待处理" value="WAIT"></el-option>
                  <el-option label="处理中" value="PROCESSING"></el-option>
                  <el-option label="无效" value="INVALID"></el-option>
                  <el-option label="已处理" value="CLOSE"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="事件类型:">
                <el-select v-model="formInline.type" placeholder="请选择" style="width: 190px">
                  <el-option label="维修" value="REPAIR"></el-option>
                  <el-option label="漏点" value="LEAKAGE"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="快速查找:">
                <el-input v-model="formInline.search" style="width: 250px" placeholder="请输入事件编号/上报部门/上报人"></el-input>
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
              <el-table-column prop="code" label="事件编号" align="center"></el-table-column>
              <el-table-column prop="type" label="事件类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 'REPAIR'">维修</span>
                  <span v-if="scope.row.type  === 'LEAKAGE'">漏点</span>
                </template>
              </el-table-column>
              <el-table-column prop="reportSiteNames" label="上报站点" align="center"></el-table-column>
              <el-table-column prop="peopleName" label="上报人" align="center"></el-table-column>
              <el-table-column prop="departmentName" label="上报部门" align="center" width="78"></el-table-column>
              <el-table-column prop="reportDate" :formatter='formatter' label="上报时间" align="center"></el-table-column>
              <el-table-column prop="updateDate" :formatter='formatter' label="更新时间" align="center"></el-table-column>
              <el-table-column prop="status" label="事件状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 'WAIT'" style="color: #FFC333;font-weight: 700;">待处理</span>
                  <span v-if="scope.row.status  === 'PROCESSING'" style="color: #FF7458;font-weight: 700;">处理中</span>
                  <span v-if="scope.row.status  === 'INVALID'" style="color: #A5A5A5;font-weight: 700;">无效</span>
                  <span v-if="scope.row.status  === 'CLOSE'" style="color: #39BF3F;font-weight: 700;">已处理</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
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
      <div class="subBox" v-show="!other">
        <Titles txt="上报信息"></Titles>
        <Forms :ruleForm="ruleForm" :type="eventType" :station="true"></Forms>
        <Titles v-show="btnshow" txt="基本信息"></Titles>
        <el-form :model="distributeForm" :rules="rules" ref="distributeForm" label-width="110px" class="demo-ruleForm">
          <el-row v-show="btnshow" :gutter="110">
            <el-col :span="8">
              <el-form-item label="处理紧张程度:" prop="handleUrgentDegree">
                <el-select v-model="distributeForm.handleUrgentDegree" placeholder="请选择" style="width: 100%;">
                  <el-option label="一般" value="一般"></el-option>
                  <el-option label="紧张" value="紧张"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="position: relative">
              <el-form-item label="处理时限:" prop="handleSize">
                <el-input v-model.number="distributeForm.handleSize"></el-input>
                <span style="position: absolute;right: -56px;top: 0;">（小时）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="btnshow">
            <el-form-item label="处理建议:" prop="proposalMethod">
              <el-input type="textarea" v-model="distributeForm.proposalMethod" :rows="4"></el-input>
            </el-form-item>
          </el-row>
          <el-row class="btnBox">
            <el-button type="primary" v-show="btnshow" @click="assign('distributeForm')">立即分派</el-button>
            <el-button type="primary" v-show="closeBtn" @click="checkStatus">修改状态</el-button>
            <el-button v-show="closeBtn" @click="closeEvent">关闭事件</el-button>
            <el-button @click="goBack">返回</el-button>
          </el-row>
        </el-form>
      </div>
      <el-dialog
        title="任务分派"
        @close="dlgClose"
        :visible.sync="dialogVisible"
        width="30%">
        <el-form label-position="top" label-width="80px" ref="opinionRef" :model="opinion" :rules="opinionRules">
          <el-form-item label="处理部门:" prop="handleDepartmentId">
            <el-select v-model="opinion.handleDepartmentId" placeholder="请选择" style="width: 100%;" @change="section">
              <el-option :label="item.postName" :value="item.id" v-for="(item, index) in sectionList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交办意见:" prop="handleIdea">
            <el-input type="textarea" v-model="opinion.handleIdea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="opinionSubmit('opinionRef')">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="修改状态"
        @close="dlgStatusClose"
        :visible.sync="dialogstatus"
        width="30%">
        <el-form label-width="90px" ref="statusRef" :model="statusForm" :rules="statusRules">
          <el-form-item label="事件状态:" prop="status">
            <el-select v-model="statusForm.status" placeholder="请选择" style="width: 100%">
              <el-option label="处理中" value="PROCESSING"></el-option>
              <el-option label="无效" value="INVALID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="填写原因:" prop="handleStatus" v-if="statusForm.status === 'INVALID'">
            <el-input type="textarea" v-model="statusForm.handleStatus" :rows="4"></el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button @click="dialogstatus = false">取消</el-button>
            <el-button type="primary" @click="statusSubmit('statusRef')">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="workDelDig"
        width="40%">
        <h3 style="color: #FF5F5F;text-align: center;margin-bottom: 25px;">您所关闭的事件包含以下未结束的工单，请确认关闭该工单后再关闭事件。</h3>
          <el-form label-width="90px" :model="workForm">
            <el-row>
              <el-col :span="12">
                <el-form-item label="上报部门:">
                  <el-input v-model="workForm.departmentName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报人:">
                  <el-input v-model="workForm.peopleName" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="事件编号:">
                  <el-input v-model="workForm.eventCode" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="承办时间:">
                  <el-date-picker type="datetime" v-model="workForm.headleDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="工单编号:">
              <el-input v-model="workForm.workSheetCode" readonly></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="处理环节:">
                  <el-input v-model="workForm.handleLink" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="text-align: right;">
              <el-button type="primary" @click="workDelDig = false">确定</el-button>
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
      workForm: {},
      workDelDig: false,
      closeBtn: false,
      sectionList: [],
      statusForm: {
        handleStatus: null,
        status: null
      },
      statusRules: {
        status: [{ required: true, message: '请选择事件状态', trigger: 'change' }],
        handleStatus: [{ required: true, message: '请填写无效原因', trigger: 'change' }]
      },
      dialogstatus: false,
      days: [],
      dialogVisible: false,
      btnshow: true,
      other: true,
      formInline: {
        search: null,
        type: null,
        status: null,
        endDate: null,
        startDate: null,
        eltotalCount: 0,
        pageSize: 10,
        pageNum: 1
      },
      tableData: [],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      distributeForm: {
        handleSize: null,
        handleUrgentDegree: null,
        proposalMethod: null
      },
      eventType: null,
      workSheet: {
        eventId: null,
        handleDepartmentId: null,
        handleDepartmentName: null,
        handleIdea: null,
        handleLink: null,
        headleDate: null
      },
      rules: {
        handleUrgentDegree: [{ required: true, message: '请选择时间紧张程度', trigger: 'change' }],
        handleSize: [
          { required: true, message: '请输入处理时限', trigger: 'blur' },
          { type: 'number', min: 1, message: '时间必须是数字且不能小于1', trigger: 'blur' }
        ],
        proposalMethod: [{ required: true, message: '请输入处理建议', trigger: 'blur' }]
      },
      opinion: {
        handleDepartmentId: null,
        handleDepartmentName: null,
        handleIdea: null,
        handleLink: null,
        headleDate: null,
        eventId: null
      },
      opinionRules: {
        handleDepartmentId: [{ required: true, message: '请选择处理部门', trigger: 'change' }],
        handleIdea: [{ required: true, message: '请输入承办意见', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.initData()
    this.initTree()
  },
  methods: {
    dlgStatusClose () {
      this.$refs['statusRef'].resetFields()
    },
    dlgClose () {
      this.$refs['opinionRef'].resetFields()
    },
    section (val) {
      this.opinion.departmentName = this.sectionList.find(v => v.id === val).postName
    },
    traverseTree (tree) {
      tree.forEach(item => {
        if (Object.is(item.level, 1)) this.sectionList.push({ postName: item.postName, id: item.id })
        if (item.hasOwnProperty('children')) this.traverseTree(item.children)
      })
    },
    async initTree () {
      let res = await this.$api.userList.getPostTreeList()
      if (res.code === 200) this.traverseTree(res.data)
      else this.$message.error('部门列表获取失败')
    },
    statusSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (Object.is(this.statusForm.status, 'PROCESSING')) this.statusForm.handleStatus = null
          let res = await this.$api.maintain.eventStatus(this.opinion.eventId, this.statusForm)
          if (Object.is(res.code, 200)) {
            this.dialogstatus = false
            this.$message.success('修改事件状态成功')
            this.other = true
            this.initData()
          } else this.$message.error('修改事件状态失败')
        }
      })
    },
    checkStatus () {
      this.dialogstatus = true
    },
    closeEvent () {
      this.$confirm('此操作将关闭事件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ress = await this.$api.maintain.eventToWork(this.opinion.eventId)
        if (Object.is(ress.code, 200)) {
          if (Object.is(ress.data.length, 0)) {
            let res = await this.$api.maintain.eventClose(this.opinion.eventId)
            if (Object.is(res.code, 200)) {
              this.$message.success('事件关闭成功')
              this.other = true
              this.initData()
            } else this.$message.error('事件关闭失败')
          } else {
            ress.data[0].headleDate *= 1000
            switch (ress.data[0].handleLink) {
              case 'CREATED':
                ress.data[0].handleLink = '分派'
                break
              case 'ASSIGNED':
                ress.data[0].handleLink = '处理'
                break
              case 'RECIVED':
                ress.data[0].handleLink = '采购'
                break
              case 'ACCEPTED':
                ress.data[0].handleLink = '关单审核'
                break
              case 'CLOSE':
                ress.data[0].handleLink = '已结束'
                break
            }
            this.workForm = ress.data[0]
            this.workDelDig = true
          }
        } else this.$message.error('事件详情获取失败')
      }).catch(() => {
        return false
      })
    },
    // 事件分派提交
    opinionSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.opinion.headleDate = parseInt((new Date().getTime() / 1000))
          let res = await this.$api.maintain.eventOut({
            assignInfo: this.distributeForm,
            eventType: this.eventType,
            workSheet: this.opinion
          })
          if (Object.is(res.code, 200)) {
            this.$refs['distributeForm'].resetFields()
            this.dialogVisible = false
            this.$message.success('事件分派成功')
            this.other = true
            this.initData()
          } else this.$message.error('事件分派失败')
        }
      })
    },
    // 重置搜索条件
    reset () {
      this.formInline.pageNum = 1
      this.formInline.search = null
      this.formInline.type = null
      this.formInline.status = null
      this.formInline.endDate = null
      this.formInline.startDate = null
      this.days = []
      this.initData()
    },
    // 时间选择切换
    dayCheck (val) {
      if (val) {
        this.formInline.startDate = parseInt(val[0] / 1000)
        this.formInline.endDate = parseInt(val[1] / 1000)
      } else {
        this.formInline.startDate = null
        this.formInline.endDate = null
      }
    },
    // 表格转时间
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000 })
      else return '暂无数据'
    },
    // 初始化数据
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let res = await this.$api.maintain.getEventList(this.formInline)
      if (Object.is(res.code, 200)) {
        this.formInline.eltotalCount = res.data.total
        this.tableData = res.data.list
      } else this.$message.error('事件信息获取失败')
    },
    // 打开部门弹窗
    assign (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) this.dialogVisible = true
      })
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
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
    async handle ({ id, status, type }) {
      let res = await this.$api.maintain.getEventDetails(id)
      if (Object.is(res.code, 200)) {
        this.opinion.handleLink = 'CREATED'
        this.eventType = type
        this.opinion.eventId = id
        this.ruleForm = res.data
        this.ruleForm.reportDate *= 1000
        this.other = false
        if (Object.is(status, 'WAIT')) this.btnshow = true
        else this.btnshow = false
        if (!Object.is(status, 'CLOSE')) this.closeBtn = true
        else this.closeBtn = false
      } else this.$message.error('事件详情获取失败')
    },
    goBack () {
      this.other = true
      this.$refs['distributeForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    width: 100%;
    height: 100%;
    .tableBox{
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
      padding-bottom: 20px;
      box-sizing: border-box;
      background: #fff!important;
      border-radius:4px;
      .demo-ruleForm{
        padding: 0 20% 0 1.8%;
      }
      .btnBox{
        padding-left: 20px;
      }
    }
  }
</style>
