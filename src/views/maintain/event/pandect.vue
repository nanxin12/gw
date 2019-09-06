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
              <el-button type="danger" @click="allDel">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="boxs">
        <div class="boxContents">
          <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
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
                <el-button size="mini" type="primary" plain round @click="handle(scope.row)">详情</el-button>
                <el-button size="mini" type="danger" plain round @click="eventDel(scope.row.id)">删除</el-button>
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
      <el-row style="padding-left: 65px">
        <el-button @click="goBack">返回</el-button>
      </el-row>
    </div>
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
      idList: [],
      days: [],
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
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    handleSelectionChange (val) {
      this.idList = []
      val.forEach(v => this.idList.push(v.id))
    },
    allDel () {
      if (this.idList.length < 1) return this.$message.error('请勾选要删除的事件')
      this.$confirm('此操作将永久删除这些文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.maintain.eventAllDel(this.idList)
        if (Object.is(res.code, 200)) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => {
        return false
      })
    },
    eventDel (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$api.maintain.eventDel(id)
        if (Object.is(res.code, 200)) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => {
        return false
      })
    },
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
    dayCheck (val) {
      if (val) {
        this.formInline.startDate = parseInt(val[0] / 1000)
        this.formInline.endDate = parseInt(val[1] / 1000)
      } else {
        this.formInline.startDate = null
        this.formInline.endDate = null
      }
    },
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000 })
      else return '暂无数据'
    },
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let res = await this.$api.maintain.getEventList(this.formInline)
      if (Object.is(res.code, 200)) {
        this.formInline.eltotalCount = res.data.total
        this.tableData = res.data.list
      } else this.$message.error('事件信息获取失败')
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
    async handle ({ id, type }) {
      this.eventType = type
      let res = await this.$api.maintain.getEventDetails(id)
      if (Object.is(res.code, 200)) {
        this.ruleForm = res.data
        this.ruleForm.reportDate *= 1000
        this.other = false
      } else this.$message.error('事件详情获取失败')
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
      background: #fff;
      border-radius:4px;
      .btnBox{
        padding-left: 20px;
      }
    }
  }
</style>
