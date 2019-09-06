<template>
  <div class="box">
    <div class="boxHeader">
      <div class="top">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="申请时间:">
            <el-date-picker style="width: 200px;"
              value-format="timestamp"
              v-model="formInline.applyDate"
              type="date"
              placeholder="请选择">
            </el-date-picker>
          </el-form-item>
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
            <el-input v-model="formInline.name" style="width: 200px;" placeholder="计划名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="initData('query')">查找</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="primary" @click="taskSend">任务派发</el-button>
            <el-button type="primary" @click="formDig = true">添加临时计划</el-button>
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
          <el-table-column prop="userCode" label="计划类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type === 'ROUTINE'">常规</span>
              <span v-if="scope.row.type === 'TEMPORARY'">临时</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="计划名称" align="center"></el-table-column>
          <el-table-column prop="regionName" label="区域名称" align="center"></el-table-column>
          <el-table-column label="巡检对象" :formatter="objFormatter" align="center"></el-table-column>
          <el-table-column prop="address" label="巡检员" align="center">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.sites" :key="index">
                <span v-for="(items, indexs) in item.users" :key="indexs">{{items.name}} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="waterMeterId" label="巡检周期" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.cycle === 'DAY'">天</span>
              <span v-if="scope.row.cycle === 'WEEK'">周</span>
              <span v-if="scope.row.cycle === 'MONTH'">月</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" :formatter='formatter' label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endDate" :formatter='formatter' label="结束时间" align="center"></el-table-column>
          <el-table-column prop="remarks" label="备注信息" align="center"></el-table-column>
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
              <el-button type="primary" @click="taskAllocation(scope.row.id)" size="mini" round plain>分派</el-button>
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
    <el-dialog :visible.sync="formDig" title="添加临时巡检计划" width="45%" @close="formClose">
      <el-form label-width="100px" ref="formRef" :model="form" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检区域:" prop="regionCode">
              <el-select v-model="form.regionCode" placeholder="请选择巡检区域" @change="regionChange" style="width: 100%">
                <el-option v-for="item in townList" :key="item.id" :label="item.positionName" :value="item.code" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称:" prop="name">
              <el-input v-model="form.name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="巡检对象:" prop="objs">
          <el-select v-model="form.objs" multiple placeholder="请选择巡检对象" style="width: 100%">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in objList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检人员:" prop="sites">
              <el-cascader
                style="width: 100%"
                v-model="form.sites"
                :options="userList"
                :props="props"
                collapse-tags
                clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检周期:" prop="cycle">
              <el-select v-model="form.cycle" placeholder="请选择巡检区域" style="width: 100%">
                <el-option :label="'日'" :value="'DAY'"></el-option>
                <el-option :label="'周'" :value="'WEEK'"></el-option>
                <el-option :label="'月'" :value="'MONTH'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间:" prop="startDate">
              <el-date-picker
                style="width: 100%"
                value-format="timestamp"
                v-model="form.startDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间:" prop="endDate">
              <el-date-picker
                style="width: 100%"
                value-format="timestamp"
                v-model="form.endDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注信息:" prop="remarks">
          <el-input type="textarea" v-model="form.remarks" :rows="4"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="formDig = false">取消</el-button>
          <el-button type="primary" @click="formSubmit('formRef')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'assign',
  data () {
    return {
      regionList: [],
      userList: [],
      townList: [],
      taskList: [],
      objList: [],
      props: { multiple: true, value: 'id', label: 'name' },
      formInline: {
        cycle: null,
        pageNum: 1,
        pageSize: 10,
        name: null,
        regionCode: null,
        type: null,
        applyDate: null,
        eltotalCount: 0
      },
      formDig: false,
      form: {
        id: null,
        createDateName: JSON.parse(localStorage.getItem('userMsg')).name,
        name: null,
        regionCode: null,
        regionName: null,
        objs: [],
        sites: [],
        cycle: null,
        startDate: null,
        endDate: null,
        remarks: null,
        status: 'TOBEASSIGNED',
        type: 'TEMPORARY'
      },
      formRules: {
        name: [{ required: true, message: '请输入计划名称', trigger: 'change' }],
        regionCode: [{ required: true, message: '请选择巡检区域', trigger: 'change' }],
        objs: [{ required: true, message: '请选择巡检对象', trigger: 'change' }],
        sites: [{ required: true, message: '请选择处理成员', trigger: 'change' }],
        cycle: [{ required: true, message: '请选择巡检周期', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
      },
      tableData: []
    }
  },
  created () {
    this.initData()
    this.initObj()
    this.initUser()
    this.initRegion()
  },
  methods: {
    reset () {
      this.formInline.pageNum = 1
      this.formInline.cycle = null
      this.formInline.name = null
      this.formInline.regionCode = null
      this.formInline.type = null
      this.formInline.applyDate = null
      this.initData()
    },
    async initRegion () {
      let res = await this.$api.maintain.getRegion()
      if (res.code === 200) {
        this.regionList = res.data
      } else this.$message.error('区域列表获取失败')
    },
    async initUser () {
      let res = await this.$api.maintain.getUsers()
      if (res.code === 200) {
        this.userList = res.data
      } else this.$message.error('巡检对象获取失败')
    },
    regionChange (val) {
      this.form.regionName = this.townList.find(v => v.code === val).positionName
      let times = setTime({ type: 2 })
      this.form.name = `${this.form.regionName} ${times}`
    },
    formClose () {
      this.$refs.formRef.resetFields()
    },
    async taskSend () {
      if (this.taskList.length) {
        let res = await this.$api.maintain.taskSend({ ids: this.taskList })
        if (res.code === 200) {
          this.$message.success('计划派发成功')
          this.initData()
        } else this.$message.error('计划派发失败')
      } else this.$message.error('请勾选计划')
    },
    taskAllocation (val) {
      this.taskList = []
      this.taskList.push(val)
      this.taskSend()
    },
    formatter (row, column, cellValue) {
      if (cellValue) return setTime({ date: cellValue, number: 1000, type: 2 })
      else return '暂无数据'
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
    // 初始化数据
    async initData (val) {
      val ? this.formInline.pageNum = 1 : this.formInline.pageNum = this.formInline.pageNum
      let data = JSON.parse(JSON.stringify(this.formInline))
      if (data.applyDate) data.applyDate = parseInt(data.applyDate / 1000)
      let res = await this.$api.maintain.getPlanAss(data)
      if (res.code === 200) {
        console.log(res.data)
        this.tableData = res.data.list
        this.formInline.eltotalCount = res.data.total
      } else this.$message.error('列表数据获取失败')
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
    handleSelectionChange (val) {
      this.taskList = []
      val.forEach(item => {
        this.taskList.push(item.id)
      })
    },
    formSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form))
          data.startDate = parseInt((data.startDate / 1000))
          data.endDate = parseInt((data.endDate / 1000))
          data.objs = data.objs.join(',')
          let arr = []
          data.sites.forEach(item => {
            arr.push(item[1])
          })
          let list = []
          arr.forEach(item => {
            this.userList.forEach(items => {
              items.children.forEach(itemss => {
                if (item === itemss.id) {
                  let ifAdd = true
                  list.forEach(itemsss => {
                    if (itemsss.id === items.id) {
                      ifAdd = false
                      let objs = {
                        id: itemss.id,
                        name: itemss.name
                      }
                      itemsss.users.push(objs)
                    }
                  })
                  if (ifAdd) {
                    let obj = {
                      id: items.id,
                      name: items.name,
                      users: [
                        {
                          id: itemss.id,
                          name: itemss.name
                        }
                      ]
                    }
                    list.push(obj)
                  }
                }
              })
            })
          })
          data.sites = list
          data.createDate && (data.createDate /= 1000)
          data.createDate || (data.createDate = parseInt((new Date().getTime() / 1000)))
          let res = await this.$api.maintain.addTemporaryPlan(data)
          if (res.code === 200) {
            this.formDig = false
            this.initData()
            this.$message.success('添加成功')
          } else this.$message.error('添加失败')
        } else this.$message.error('请完善巡检信息')
      })
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
