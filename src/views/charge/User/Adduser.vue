<template>
  <div class="adduserBox">
    <Titles txt="新增用户信息"></Titles>
    <div class="abContent">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="90px">
        <el-row style="margin-bottom: 24px">
          <el-col :span="11">
            <el-form-item label="用户编号:" prop="userCode">
              <el-input v-model="ruleForm.userCode" placeholder="请输入用户编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="用户姓名:" prop="userInfo.realName">
              <el-input v-model="ruleForm.userInfo.realName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 24px">
          <el-col :span="11">
            <el-form-item label="水表编号:" prop="meterCode">
              <el-select v-model="ruleForm.meterCode" placeholder="请选择水表编号" style="width: 100%">
                <el-option :label='item.meterCode' :value='item.meterCode' v-for="item in waterList"
                           :key="item.meterCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="证件信息:" prop="userInfo.idCard">
              <el-input v-model="ruleForm.userInfo.idCard" placeholder="请输入身份证号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 24px">
          <el-col :span="11">
            <el-form-item label="用水人数:" prop="useNumber">
              <el-input v-model.number="ruleForm.useNumber" placeholder="请输入用水人数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="手机号码:" prop="userInfo.phone">
              <el-input v-model="ruleForm.userInfo.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 24px">
          <el-col :span="11">
            <el-form-item label="所属省份:">
              <el-input v-model="province" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="所属市:">
              <el-input v-model="city" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex;justify-content: space-between;margin-bottom: 24px;">
          <el-col>
            <el-form-item label="所属区域:" prop="areaId" label-width="90px">
              <el-select v-model="ruleForm.areaId" placeholder="请选择区"
                         @change="changeDistrict">
                <el-option :label="item.positionName" :value="item.code" v-for="item in districtList"
                           :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所属镇:" prop="townId" label-width="90px" label-position="center">
              <el-select v-model="ruleForm.townId" placeholder="请选择镇(街道办)"
                         @change="changeTown">
                <el-option :label="item.positionName" :value="item.code" v-for="item in townList"
                           :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所属村:" prop="villageId" label-width="90px" label-position="center">
              <el-select v-model="ruleForm.villageId" placeholder="请选择村" @change="changeVillage">
                <el-option :label="item.positionName" :value="item.code" v-for="item in villageList"
                           :key="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="abTop">
      <div class="btnBox">
        <el-button v-has="{type: 'add'}" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button type="primary" @click="resetForm">重置内容</el-button>
        <el-button v-has="{type: 'download'}" type="primary" @click="download" class="downBtn">下载模板</el-button>
        <el-button v-has="{type: 'import'}" type="primary" @click="digOpen">批量导入</el-button>
      </div>
    </div>
    <input v-show="false" ref="flie" class="upImg" type="file" name="files" @change="upload($event)">
  </div>
</template>

<script>
import Titles from '@/components/maintain/Titles'
export default {
  name: 'Adduser',
  components: {
    Titles
  },
  data () {
    let validID = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号码'))
      } else {
        let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!reg.test(value)) {
          callback(new Error('身份证号码格式不正确'))
        } else {
          callback()
        }
      }
    }
    let phones = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else {
        let reg = /^1\d{10}$/
        if (!reg.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      waterList: [],
      villageList: [],
      townList: [],
      districtList: [],
      province: '宁夏回族自治区',
      city: '固原市',
      ruleForm: {
        detailedAddress: null,
        status: 'NORMAL',
        villageId: null,
        townId: null,
        areaId: null,
        useNumber: null,
        meterCode: null,
        userCode: null,
        userInfo: {
          realName: null,
          phone: null,
          idCard: null,
          status: 'ANONYMOUS'
        }
      },
      rules: {
        userCode: [{ required: true, message: '请输入用户编号', trigger: 'blur' }],
        userInfo: {
          realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
          idCard: [{ required: true, validator: validID, trigger: 'blur' }],
          phone: [{ required: true, validator: phones, trigger: 'blur' }]
        },
        meterCode: [{ required: true, message: '请选择水表编号', trigger: 'change' }],
        useNumber: [
          { required: true, message: '请输入用水人数', trigger: 'blur' },
          { type: 'number', min: 1, message: '用水人数必须是数字且不能小于1', trigger: 'blur' }
        ],
        areaId: [{ required: true, message: '请选择区', trigger: 'change' }],
        townId: [{ required: true, message: '请选择镇(街道办)', trigger: 'change' }],
        villageId: [{ required: true, message: '请选择村', trigger: 'change' }]
      },
      districtName: null,
      upDistrictName: null,
      townName: null,
      upTownName: null,
      villageName: null,
      upVillageName: null
    }
  },
  created () {
    this.initData()
    this.initWater()
  },
  methods: {
    digOpen () {
      let promise1 = new Promise((resolve) => {
        this.$refs.ruleForm.validateField('villageId', error => {
          if (!error) resolve()
        })
      })
      let promise2 = new Promise((resolve) => {
        this.$refs.ruleForm.validateField('townId', error => {
          if (!error) resolve()
        })
      })
      let promise3 = new Promise((resolve) => {
        this.$refs.ruleForm.validateField('areaId', error => {
          if (!error) resolve()
        })
      })
      Promise.all([promise1, promise2, promise3]).then(() => {
        this.$refs.flie.click()
      })
    },
    async upload (e) {
      if ((e.target.files[0].size / (1024 * 1024)) > 2) return this.$message.error('上传文件大小不能超过2M')
      let type = e.target.files[0].name.split('.')
      if (type[1] !== 'xlsx') return this.$message.error('上传文件必须是xlsx格式')
      let detailedAddress = `${this.districtName}-${this.townName}-${this.villageName}`
      let form = new FormData()
      form.append('file', e.target.files[0])
      form.append('detailedAddress', detailedAddress)
      form.append('areaId', this.ruleForm.areaId)
      form.append('townId', this.ruleForm.townId)
      form.append('villageId', this.ruleForm.villageId)
      try {
        let res = await this.$api.sso.upAddUsers(form)
        if (res.code === 200) {
          this.$message.success('导入成功')
          this.initData()
          this.initWater()
        } else this.$message.error('导入失败')
      } catch (e) {
        this.$refs.flie.value = null
      }
    },
    // 拿到默认地区
    async initData () {
      let res = await this.$api.organizeList.getRegionByCode({ code: 640400000000 })
      if (Object.is(res.code, 200)) {
        this.districtList = res.data
      } else this.$message.error('省市区参数获取失败')
    },
    // 获取水表列表
    async initWater () {
      let res = await this.$api.sso.getNotBoundWaterMeter()
      if (res.code === 200) this.waterList = res.data
      else this.$message.error('水表信息获取失败')
    },
    // 区切换
    async changeDistrict (val) {
      if (this.ruleForm.townId) this.ruleForm.townId = null
      if (this.ruleForm.villageId) this.ruleForm.villageId = null
      this.districtName = this.districtList.find(item => item.code === val).positionName
      let res = await this.$api.organizeList.getRegionByCode({ code: val })
      if (Object.is(res.code, 200)) {
        this.townList = res.data
        this.villageList = []
      } else this.$message.error('数据获取失败')
    },
    // 镇切换
    async changeTown (val) {
      if (this.ruleForm.villageId) this.ruleForm.villageId = null
      this.townName = this.townList.find(item => item.code === val).positionName
      let res = await this.$api.organizeList.getRegionByCode({ code: val })
      if (Object.is(res.code, 200)) {
        this.villageList = res.data
      } else this.$message.error('数据获取失败')
    },
    // 村切换
    changeVillage (val) {
      this.villageName = this.villageList.find(item => item.code === val).positionName
    },
    // 提交信息
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.detailedAddress = `${this.districtName}-${this.townName}-${this.villageName}`
          let res = await this.$api.sso.addUser(this.ruleForm)
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.initWater()
            this.resetForm()
          } else this.$message.error(res.message)
        } else this.$message.error('请完善用户信息')
      })
    },
    // 下载手动导入模板
    async download () {
      let res = await this.$api.sso.userDownload()
      let url = window.URL.createObjectURL(new Blob([res]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '用户信息.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 重置表单
    resetForm () {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .adduserBox {
    height: 100%;
    width: 100%;
    border-radius:4px;
    background: #fff;
    .abContent {
      display: flex;
      justify-content: center;
      padding-top: 12px;
    }
    .abTop {
      display: flex;
      justify-content: center;

      .btnBox {
        height: 40px;
        display: flex;
        justify-content: center;
        text-indent: 150px;
      }
    }
  }
</style>
