<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-row :gutter="110" class="hang">
      <el-col :span="8">
        <el-form-item label="上报人部门:" prop="information.departmentId">
          <el-select v-model="ruleForm.information.departmentId" placeholder="请选择" style="width: 100%;" @change="section">
            <el-option :label="item.postName" :value="item.id" v-for="item in sectionList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上报人名称:" prop="information.peopleId">
          <el-select v-model="ruleForm.information.peopleId" placeholder="请选择" style="width: 100%;" @change="people">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in personList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上报时间:" prop="information.reportDate">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.information.reportDate" style="width: 100%;" value-format="timestamp"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="110" class="hang">
      <el-col :span="16">
        <el-form-item label="上报站点:" prop="information.reportSiteNames">
          <el-select v-model="ruleForm.information.reportSiteNames" multiple placeholder="请选择" style="width: 100%;">
            <el-option :label="item.name" :value="item.id" v-for="item in stationList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="type === 'REPAIR'">
        <el-form-item label="事件内容:" prop="event.content">
          <el-select v-model="ruleForm.event.content" placeholder="请选择" style="width: 100%;">
            <el-option label="漏了" value="漏水"></el-option>
            <el-option label="坏了" value="坏了"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="hang">
      <el-form-item label="事发地址:" prop="event.incidentAddress">
        <el-input v-model="ruleForm.event.incidentAddress" placeholder="请输入"></el-input>
      </el-form-item>
    </el-row>
    <el-row class="hang">
      <el-form-item label="事件描述:" prop="event.incidentDesc">
        <el-input type="textarea" v-model="ruleForm.event.incidentDesc" :rows="4" placeholder="请输入"></el-input>
      </el-form-item>
    </el-row>
    <el-row class="hang" :gutter="110">
      <el-col :span="8">
        <el-form-item label="处理站点:" prop="information.handleSiteId">
          <el-select v-model="ruleForm.information.handleSiteId" placeholder="请选择" style="width: 100%;" @change="handleSite">
            <el-option :label="item.name" :value="item.id" v-for="item in stationList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="btnBox">
      <el-button @click="resetForm('ruleForm')">重置表单</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">立即上报</el-button>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'Forms',
  props: ['type'],
  data () {
    return {
      sectionList: [],
      personList: [],
      stationList: [],
      ruleForm: {
        event: {
          type: null,
          incidentAddress: null,
          incidentDesc: null,
          createDate: null,
          content: null
        },
        information: {
          reportDate: new Date().getTime(),
          createDate: null,
          departmentName: null,
          departmentId: null,
          peopleName: null,
          peopleId: null,
          reportSiteNames: [],
          handleSiteName: null,
          handleSiteId: null
        }
      },
      rules: {
        information: {
          reportDate: [{ required: true, message: '请选择上报时间', trigger: 'change' }],
          departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
          peopleId: [{ required: true, message: '请选择上报人', trigger: 'change' }],
          reportSiteNames: [{ type: 'array', required: true, message: '请选择上报站点', trigger: 'change' }],
          handleSiteId: [{ required: true, message: '请选择处理站点', trigger: 'change' }]
        },
        event: {
          incidentAddress: [{ required: true, message: '请输入事件地址', trigger: 'blur' }],
          incidentDesc: [{ required: true, message: '请输入事件描述', trigger: 'blur' }],
          content: [{ required: true, message: '请选择事件内容', trigger: 'change' }]
        }
      }
    }
  },
  created () {
    this.initTree()
    this.initStation()
  },
  methods: {
    traverseTree (tree) {
      tree.forEach(item => {
        if (Object.is(item.level, 1)) this.sectionList.push({ postName: item.postName, id: item.id })
        if (item.hasOwnProperty('children')) this.traverseTree(item.children)
      })
    },
    async initStation () {
      let res = await this.$api.product.getStationNoPage()
      if (res.code === 200) {
        this.stationList = res.data
      } else this.$message.error('站点列表获取失败')
    },
    async initTree () {
      let res = await this.$api.userList.getPostTreeList()
      if (Object.is(res.code, 200)) this.traverseTree(res.data)
      else this.$message.error('部门列表获取失败')
    },
    section (val) {
      this.ruleForm.information.departmentName = this.sectionList.find(v => v.id === val).postName
      this.$api.maintain.getUser(val).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.personList = res.data
        } else this.$message.error('上报人员获取失败')
      })
    },
    people (val) {
      this.ruleForm.information.peopleName = this.personList.find(v => v.id === val).name
    },
    handleSite (val) {
      this.ruleForm.information.handleSiteName = this.stationList.find(v => v.id === val).name
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm))
          let str = ''
          data.information.reportSiteNames.forEach((items, indexs) => {
            let index = this.stationList.findIndex(item => item.id === items)
            if ((indexs + 1) === data.information.reportSiteNames.length) {
              str += this.stationList[index].name
            } else {
              str += this.stationList[index].name + ','
            }
          })
          data.information.reportSiteNames = str
          let cTime = parseInt(new Date().getTime() / 1000)
          data.event.createDate = cTime
          data.information.createDate = cTime
          data.information.reportDate = parseInt(data.information.reportDate / 1000)
          data.event.type = this.type
          let res = await this.$api.maintain.submits(data)
          if (Object.is(res.code, 200)) {
            this.$message.success('上报成功')
            this.$refs['ruleForm'].resetFields()
          } else this.$message.error('上报失败')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .demo-ruleForm{
    padding: 0 20% 0 3%;
    .hang{
      padding-bottom: 20px;
    }
    .btnBox{
      padding-left: 25px;
    }
  }
</style>
