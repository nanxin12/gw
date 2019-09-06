<template>
  <div class="box">
    <div class="boxHeader">
      <div class="top">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="巡检区域:">
            <el-select v-model="formInline.regionCode" style="width: 200px;" placeholder="请选择">
              <el-option v-for="item in regionList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检周期:" >
            <el-select v-model="formInline.cycle" style="width: 200px;" placeholder="请选择">
              <el-option label="天" value="DAY"></el-option>
              <el-option label="周" value="WEEK"></el-option>
              <el-option label="月" value="MONTH"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划类型:" >
            <el-select v-model="formInline.type" style="width: 200px;" placeholder="请选择">
              <el-option label="常规" value="ROUTINE"></el-option>
              <el-option label="临时" value="TEMPORARY"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划名称:">
            <el-input v-model="formInline.name" placeholder="计划名称"></el-input>
          </el-form-item>
          <el-form-item label="申请时间:">
            <el-date-picker
              value-format="timestamp"
              v-model="formInline.applyDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData('query')">查找</el-button>
            <el-button type="primary" @click="reaset">重置</el-button>
            <el-button type="danger" @click="allDel">批量删除</el-button>
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
          <el-table-column prop="name" label="计划类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'ROUTINE'">常规</span>
              <span v-if="scope.row.type === 'TEMPORARY'">临时</span>
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
          <el-table-column prop="createDateName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="createDate" :formatter='formatter' label="申请时间" align="center"></el-table-column>
          <el-table-column prop="createTime" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'TOBEASSIGNED'">待分派</span>
              <span v-if="scope.row.status === 'ASSIGNED'">已分派</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click="delPlan(scope.row.id)" size="mini" round plain>删除</el-button>
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
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'assignPandect',
  data () {
    return {
      regionList: [],
      delList: [],
      examineDig: false,
      formInline: {
        type: null,
        cycle: null,
        name: null,
        regionCode: null,
        applyDate: null,
        eltotalCount: 0,
        pageSize: 10,
        pageNum: 1
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
    async allDel () {
      let res = await this.$api.maintain.delAssignPandect({ ids: this.delList })
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.initData()
      } else this.$message.error('删除失败')
    },
    delPlan (val) {
      this.delList = []
      this.delList.push(val)
      this.allDel()
    },
    handleSelectionChange (val) {
      this.delList = []
      val.forEach(item => {
        this.delList.push(item.id)
      })
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
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000, type: 2 })
      else return '暂无数据'
    },
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let data = JSON.parse(JSON.stringify(this.formInline))
      if (data.applyDate) data.applyDate = parseInt(data.applyDate / 1000)
      let res = await this.$api.maintain.getAssignPandect(data)
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
      this.formInline.applyDate = null
      this.formInline.regionCode = null
      this.formInline.cycle = null
      this.formInline.type = null
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
