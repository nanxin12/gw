<template>
  <el-form :model="ruleForm" label-width="110px" class="demo-ruleForm">
    <el-row :gutter="110" class="hang">
      <el-col :span="8">
        <el-form-item label="上报人部门:" prop="name">
          <el-input v-model="ruleForm.departmentName" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上报人名称:" prop="region">
          <el-input v-model="ruleForm.peopleName" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上报时间:">
          <el-date-picker type="date" readonly placeholder="选择日期" v-model="ruleForm.reportDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="110" class="hang">
      <el-col :span="16">
        <el-form-item label="上报站点:" prop="name">
          <el-input v-model="ruleForm.reportSiteNames" readonly></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" v-if="type === 'REPAIR'">
        <el-form-item label="事件内容:" prop="name">
          <el-input v-model="ruleForm.content" readonly></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="hang">
      <el-form-item label="事发地址:" prop="desc">
        <el-input v-model="ruleForm.incidentAddress" readonly></el-input>
      </el-form-item>
    </el-row>
    <el-row class="hang">
      <el-form-item label="事件描述:" prop="desc">
        <el-input type="textarea" v-model="ruleForm.incidentDesc" :rows="4" readonly></el-input>
      </el-form-item>
    </el-row>
    <el-row v-if="station" :gutter="110" class="hang">
      <el-col :span="8">
        <el-form-item label="处理站点:" prop="name">
          <el-input v-model="ruleForm.handleSiteName" readonly></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'EventDetails',
  props: ['ruleForm', 'type', 'station']
}
</script>

<style lang="scss" scoped>
  .demo-ruleForm{
    padding: 0 20% 0 1.8%;
  }
</style>
