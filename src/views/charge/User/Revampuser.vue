<template>
  <div>
    <el-form :inline="true" :model="form" label-width="100px" label-position="right">
      <el-form-item label="用户编号:">
        <el-input v-model="form.userCode" placeholder="请输入用户编号"></el-input>
      </el-form-item>
      <el-form-item label="水表编号:">
        <el-input v-model="form.meterCode" placeholder="请输入水表编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData('query')">立即查询</el-button>
        <el-button type="primary" @click="reset">内容重置</el-button>
      </el-form-item>
    </el-form>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{(form.page-1)*form.size+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userCode" label="用户编号" align="center"></el-table-column>
          <el-table-column prop="username" label="用户姓名" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.realName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="telephone" label="手机号码" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号码" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.userInfo.idCard}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useNumber" width="80" label="用水人数" align="center"></el-table-column>
          <el-table-column prop="detailedAddress" label="所属区域" align="center"></el-table-column>
          <el-table-column prop="address" label="用户状态" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 'CANCEL'" type="danger">销户</el-tag>
              <el-tag v-if="scope.row.status === 'NORMAL'" type="success">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="meterCode" label="水表编号" align="center"></el-table-column>
          <el-table-column prop="registerTime" :formatter='formatter' label="报装日期" align="center">
          </el-table-column>
          <el-table-column prop="balanceStr" label="余额(元)" align="center"></el-table-column>
          <el-table-column prop="balance" label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain round v-has="{type: 'update'}" type="warning" style="margin: 5px" size="mini" @click="putUser(scope.row)">编辑用户</el-button>
              <el-button plain round v-has="{type: 'replace'}" type="warning" style="margin: 5px" size="mini" @click="putMeter(scope.row)">更换水表</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.eltotalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="编辑用户" :visible.sync="userDig" width="30%" center @close="closeUser" @opened="userOpen">
      <el-form :model="putUserForm" :rules="UserRules" ref="userRef" label-width="100px">
        <el-form-item label="用户编号:">
          <el-input v-model="putUserForm.userCode" readonly></el-input>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="userInfo.realName">
          <el-input v-model="putUserForm.userInfo.realName" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件信息:" prop="userInfo.idCard">
          <el-input v-model="putUserForm.userInfo.idCard" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="用水人数:" prop="useNumber">
          <el-input v-model.number="putUserForm.useNumber" placeholder="请输入用水人数"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="userInfo.phone">
          <el-input v-model="putUserForm.userInfo.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="所属区域:" prop="areaId">
          <el-select v-model="putUserForm.areaId" placeholder="请选择区" style="width: 100%;" @change="changeDistrict">
            <el-option :label="item.positionName" :value="item.code" v-for="item in districtList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属镇:" prop="townId">
          <el-select v-model="putUserForm.townId" placeholder="请选择镇(街道办)" style="width: 100%;" @change="changeTown">
            <el-option :label="item.positionName" :value="item.code" v-for="item in townList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村:" prop="villageId">
          <el-select v-model="putUserForm.villageId" placeholder="请选择村" style="width: 100%;" @change="changeVillage">
            <el-option :label="item.positionName" :value="item.code" v-for="item in villageList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitput('userRef')">确 定</el-button>
        <el-button @click="userDig = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑水表" :visible.sync="meterDig" width="30%" center  @close="closeMeter">
      <el-form :model="putMeterForm" :rules="meterRules" ref="meterRef" label-width="100px">
        <el-form-item label="用户姓名">
          <el-input v-model="putMeterForm.name" readonly placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="水表编号" prop="meterCode">
          <el-select v-model="putMeterForm.meterCode" style="width: 100%">
            <el-option :label='item.meterCode' :value='item.meterCode' v-for="item in meterList"
                       :key="item.meterCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitputwater('meterRef')">确 定</el-button>
        <el-button @click="meterDig = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'Revampuser',
  data () {
    let validID = (rule, value, callback) => {
      if (!value) {
        callback(new Error('身份证号码不能为空'))
      } else {
        let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (!reg.test(value)) {
          callback(new Error('身份证号码不正确'))
        } else {
          callback()
        }
      }
    }
    let phones = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else {
        let reg = /^1\d{10}$/
        if (!reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      nowForm: {},
      villageList: [],
      townList: [],
      districtList: [],
      putMeterForm: {
        meterCode: null,
        id: null,
        name: null
      },
      meterRules: {
        meterCode: [{ required: true, message: '请选择水表编号', trigger: 'change' }]
      },
      userDig: false,
      meterDig: false,
      meterList: [],
      form: {
        page: 1,
        size: 10,
        eltotalCount: 0,
        meterCode: null,
        status: 'NORMAL',
        userCode: null
      },
      tableData: [],
      putUserForm: {
        detailedAddress: null,
        villageId: null,
        townId: null,
        areaId: null,
        useNumber: null,
        meterCode: null,
        userCode: null,
        userInfo: {
          realName: null,
          phone: null,
          idCard: null
        }
      },
      UserRules: {
        userInfo: {
          realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
          phone: [{ required: true, validator: phones, trigger: 'blur' }],
          idCard: [{ required: true, validator: validID, trigger: 'blur' }]
        },
        useNumber: [
          { required: true, message: '请输入用水人数', trigger: 'blur' },
          { type: 'number', min: 1, message: '用水人必须是数字且不能小于1', trigger: 'blur' }
        ],
        areaId: [{ required: true, message: '请选择区', trigger: 'change' }],
        townId: [{ required: true, message: '请选择镇(街道办)', trigger: 'change' }],
        villageId: [{ required: true, message: '请选择村', trigger: 'change' }]
      },
      districtName: null,
      townName: null,
      villageName: null
    }
  },
  created () {
    this.initData()
    this.initDistrict()
  },
  methods: {
    userOpen () {
      this.putUserForm = this.nowForm
    },
    // 初始化区县
    async initDistrict () {
      let res = await this.$api.organizeList.getRegionByCode({ code: 640400000000 })
      if (res.code === 200) this.districtList = res.data
      else this.$message.error('地区信息获取失败')
    },
    // 区切换
    async changeDistrict (val) {
      if (this.putUserForm.townId) this.putUserForm.townId = ''
      if (this.putUserForm.villageId) this.putUserForm.villageId = ''
      this.districtName = this.districtList.find(item => item.code === val).positionName
      let res = await this.$api.organizeList.getRegionByCode({ code: val })
      if (Object.is(res.code, 200)) {
        this.townList = res.data
        this.villageList = []
      } else this.$message.error('数据获取失败')
    },
    // 镇切换
    async changeTown (val) {
      if (this.putUserForm.villageId) this.putUserForm.villageId = ''
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
    // 关闭更换水表弹窗
    closeMeter () {
      this.$refs['meterRef'].resetFields()
    },
    // 关闭修改用户弹窗
    closeUser () {
      this.$refs['userRef'].resetFields()
    },
    // 表格转时间
    formatter (row) {
      if (row.userInfo.registerTime) return setTime({ date: row.userInfo.registerTime, number: 1000 })
      else return '暂无数据'
    },
    // 重置搜索条件
    reset () {
      this.form.page = 1
      this.form.meterCode = null
      this.form.userCode = null
      this.initData()
    },
    // 修改水表
    async putMeter ({ id, userInfo }) {
      let res = await this.$api.sso.getNotBoundWaterMeter()
      if (res.code === 200) {
        this.meterList = res.data
        this.putMeterForm.name = userInfo.realName
        this.putMeterForm.id = id
        this.meterDig = true
      } else this.$message.error('水表数据获取失败')
    },
    // 修改水表提交
    submitputwater (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let res = await this.$api.sso.changeMeter(this.putMeterForm)
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.meterDig = false
            this.initData()
          } else {
            this.$message.error(res.message)
            this.meterDig = false
          }
        } else this.$message.error('请完善用户信息')
      })
    },
    // 初始化数据
    async initData (val) {
      val ? this.form.page = 1 : this.form.page = this.form.page
      let res = await this.$api.sso.getUserList(this.form)
      if (Object.is(res.code, 200)) {
        this.tableData = res.data.list
        this.form.eltotalCount = res.data.totalCount
      } else this.$message.error('用户信息获取失败')
    },
    // 修改用户提交
    submitput (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.putUserForm.detailedAddress = `${this.districtName}${this.townName}${this.villageName}`
          let res = await this.$api.sso.putUser(this.putUserForm)
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.userDig = false
            this.initData()
          } else this.$message.error('修改失败')
        } else this.$message.error('请完善用户信息')
      })
    },
    // 点击编辑用户
    async putUser (data) {
      let address = data.detailedAddress.split('-')
      this.districtName = address[0]
      this.townName = address[1]
      this.villageName = address[2]
      this.nowForm = JSON.parse(JSON.stringify(data))
      this.nowForm.areaId = Number(this.nowForm.areaId)
      this.nowForm.townId = Number(this.nowForm.townId)
      this.nowForm.villageId = Number(this.nowForm.villageId)
      delete this.nowForm.meterCode
      delete this.nowForm.balance
      delete this.nowForm.cancelTime
      delete this.nowForm.status
      delete this.nowForm.userInfo.registerTime
      delete this.nowForm.userInfo.status
      let ress = await this.$api.organizeList.getRegionByCode({ code: this.nowForm.areaId })
      if (ress.code === 200) this.townList = ress.data
      else this.$message.error('地区信息获取失败')
      let resss = await this.$api.organizeList.getRegionByCode({ code: this.nowForm.townId })
      if (resss.code === 200) this.villageList = resss.data
      else this.$message.error('地区信息获取失败')
      this.userDig = true
    },
    // 改变每页显示条数
    handleSizeChange (values) {
      this.form.size = values
      this.initData()
    },
    // 改变页码
    handleCurrentChanges (values) {
      this.form.page = values
      this.initData()
    },
    // 修改表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    position: relative;
    width: 100%;
    .boxContent {
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
</style>
