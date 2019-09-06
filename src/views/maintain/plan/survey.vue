<template>
  <div class="box">
    <div class="boxHeader">
      <div class="top">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="巡检区域:">
            <el-select v-model="formInline.regionCode" placeholder="请选择" style="width: 190px">
              <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划名称:">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="申请时间:">
            <el-date-picker
              value-format="timestamp"
              v-model="formInline.applyDate"
              type="date"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData('query')">查找</el-button>
            <el-button type="primary" @click="reaset">重置</el-button>
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
          <el-table-column prop="name" label="计划名称" align="center"></el-table-column>
          <el-table-column prop="regionName" label="区域名称" align="center"></el-table-column>
          <el-table-column :formatter="objFormatter" label="巡检对象" align="center"></el-table-column>
          <el-table-column prop="idCard" label="巡检员" align="center">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.sites" :key="index">
                <span v-for="(items, indexs) in item.users" :key="indexs">{{items.name}} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cycle" label="巡检周期" align="center" width="78">
            <template slot-scope="scope">
              <span v-if="scope.row.cycle === 'DAY'">天</span>
              <span v-if="scope.row.cycle === 'WEEK'">周</span>
              <span v-if="scope.row.cycle === 'MONTH'">月</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" :formatter='formatter' label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endDate" :formatter='formatter' label="结束时间" align="center"></el-table-column>
          <el-table-column prop="remarks" label="备注信息" align="center"></el-table-column>
          <el-table-column prop="createTime" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'SUBMITTO'">待审批</span>
              <span v-if="scope.row.status === 'REJECTED'">已驳回</span>
              <span v-if="scope.row.status === 'REJECTED'">已通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="createDateName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="createDate" :formatter='formatter' label="申请时间" align="center"></el-table-column>
          <el-table-column prop="createTime" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" plain round @click="examine(scope.row.id)">审批</el-button>
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
    <el-dialog :visible.sync="examineDig" title="计划审批" width="30%" @close="examineClose">
      <el-form label-width="100px" ref="examineRef" :rules="examineRules" :model="examineForm">
        <el-form-item label="计划状态:" prop="status">
          <el-select v-model="examineForm.status" placeholder="请选择审批状态" style="width: 100%">
            <el-option label="通过" value="PASSED"></el-option>
            <el-option label="驳回" value="REJECTED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批意见:" prop="applyOpinion">
          <el-input type="textarea" v-model="examineForm.applyOpinion" :rows="4" placeholder="请输入审批意见"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="examineDig = false">取消</el-button>
          <el-button type="primary" @click="formSubmit('examineRef')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'survey',
  data () {
    return {
      regionList: [],
      examineDig: false,
      formInline: {
        name: null,
        regionCode: null,
        applyDate: null,
        eltotalCount: 0,
        pageSize: 10,
        pageNum: 1
      },
      examineForm: {
        planId: null,
        status: null,
        applyOpinion: null
      },
      examineRules: {
        status: [{ required: true, message: '请选择审批状态', trigger: 'change' }],
        applyOpinion: [{ required: true, message: '请输入审批意见', trigger: 'blur' }]
      },
      tableData: []
    }
  },
  created () {
    this.initData()
    this.initObj()
    this.initRegion()
  },
  methods: {
    async initRegion () {
      let res = await this.$api.maintain.getRegion()
      if (res.code === 200) {
        this.regionList = res.data
      } else this.$message.error('区域列表获取失败')
    },
    // 遍历出巡检对象
    objFormatter (row) {
      let arr = []
      let arrs = row.objs.split(',')
      arrs.forEach(item => {
        arr.push(this.objList.find(items => Number(item) === items.id).name + ' ')
      })
      return arr
    },
    // 初始化巡检对象
    async initObj () {
      let res = await this.$api.maintain.getPlanObj()
      if (res.code === 200) {
        this.objList = res.data
      } else this.$message.error('巡检对象获取失败')
    },
    formSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$api.maintain.examinePlan(this.examineForm)
          if (res.code === 200) {
            this.$message.success('计划审批成功')
            this.examineDig = false
            this.initData()
          } else this.$message.error('计划审批失败')
        } else this.$message.error('请完善审批信息')
      })
    },
    examineClose () {
      this.$refs.examineRef.resetFields()
    },
    examine (id) {
      this.examineForm.planId = id
      this.examineDig = true
    },
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000, type: 2 })
      else return '暂无数据'
    },
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let data = JSON.parse(JSON.stringify(this.formInline))
      if (data.applyDate) data.applyDate = parseInt(data.applyDate / 1000)
      let res = await this.$api.maintain.getPlanRatifyList(data)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.formInline.eltotalCount = res.data.total
      } else this.$message.error('数据获取失败')
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    reaset () {
      this.formInline.pageNum = 1
      this.formInline.name = null
      this.formInline.regionCode = null
      this.formInline.applyDate = null
      this.initData()
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
    .boxHeader{
      padding: 15px;
      .el-form-item{
        margin: 0 30px 15px 0;
      }
    }
    .boxContent{
      min-height: 593px;
      .tableBox{
        border-radius: 10px;
        background: #fff;
        padding: 20px;
        margin-bottom: 30px;
      }
    }
  }
</style>
