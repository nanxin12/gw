<template>
  <div class="priceBox">
    <div v-has="{type: 'add'}" class="pbTop">
      <i class="el-icon-circle-plus-outline"></i><p @click="addWater">添加水价</p>
    </div>
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData" stripe class="tables" border :header-cell-style="tableHeaderColor">
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="minNum" label="每月用水量最小值(吨)" align="center"></el-table-column>
          <el-table-column prop="maxNum" label="每月用水量最大值(吨)" align="center"></el-table-column>
          <el-table-column label="单价(元)" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.price | money}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button plain v-has="{type: 'update'}" type="success" round size="mini" @click="putWater(scope.row)">编辑</el-button>
              <el-button plain v-has="{type: 'delete'}" type="danger" round
                        size="mini" @click="deletes(scope.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="digTitle" :visible.sync="priceDig" width="30%" @close="digClose" @opened="openForm">
      <el-form :model="priceForm" :rules="priceRules" ref="priceRef" label-width="170px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="每月用水量最小值:" prop="minNum">
              <el-input v-model.number="priceForm.minNum" placeholder="请输入最小用水量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">吨</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="每月用水量最大值:" prop="maxNum">
              <el-input v-model.number="priceForm.maxNum" placeholder="请输入最大用水量"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">吨</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="用水单价:" prop="price">
              <el-input v-model="priceForm.price" placeholder="请输入价格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <p style="height: 40px;line-height: 40px;margin-left: 10px">元</p>
          </el-col>
        </el-row>
        <el-form-item style="text-align: right">
          <el-button @click="priceDig = false">取 消</el-button>
          <el-button type="primary" @click="sumbit('priceRef')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Price',
  data () {
    let waterMinNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('水量不能为空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('水量格式不正确'))
        } else {
          if (this.priceForm.maxNum) {
            this.$refs.priceRef.validateField('maxNum')
          }
          callback()
        }
      }
    }
    let waterMaxNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('水量不能为空'))
      } else {
        let reg = /^[0-9]+(.[0-9]{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('水量格式不正确'))
        } else if (this.priceForm.minNum && (this.priceForm.minNum >= this.priceForm.maxNum)) {
          callback(new Error('最小用水量不能大于等于最大用水量'))
        } else {
          callback()
        }
      }
    }
    let moneynumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('金额不能为空'))
      } else {
        let reg = /^\d{1,3}(\.\d{1,2})?$/
        if (!reg.test(value)) {
          callback(new Error('价格格式不正确'))
        } else {
          callback()
        }
      }
    }
    return {
      putForm: {},
      digTitle: null,
      priceDig: false,
      priceForm: {
        minNum: null,
        maxNum: null,
        price: null,
        id: null
      },
      priceRules: {
        maxNum: [{ required: true, validator: waterMaxNumber, trigger: 'blur' }],
        minNum: [{ required: true, validator: waterMinNumber, trigger: 'blur' }],
        price: [{ required: true, validator: moneynumber, trigger: 'blur' }]
      },
      tableData: []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    openForm () {
      if (this.digTitle === '编辑水价') {
        this.priceForm.maxNum = this.putForm.maxNum
        this.priceForm.minNum = this.putForm.minNum
        this.priceForm.price = this.putForm.price
        this.priceForm.id = this.putForm.id
      }
    },
    digClose () {
      this.$refs.priceRef.resetFields()
    },
    // 添加水价按钮
    addWater () {
      this.digTitle = '添加水价'
      this.priceDig = true
    },
    // 删除水价
    deletes (id) {
      this.$confirm('确认删除水价', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        let res = await this.$api.sso.delWaterPrice({ id })
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.initData()
        } else this.$message.error('删除失败')
      }).catch(() => false)
    },
    // 改变表头样式
    tableHeaderColor ({ rowIndex }) {
      if (rowIndex === 0) return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
    },
    // 修改水价打开
    putWater (data) {
      this.digTitle = '编辑水价'
      this.putForm = data
      this.priceDig = true
    },
    // 添加水价提交
    sumbit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.digTitle === '添加水价') {
            let data = JSON.parse(JSON.stringify(this.priceForm))
            delete data.id
            let res = await this.$api.sso.addWaterPrice(data)
            if (res.code === 200) {
              this.$message.success('添加成功')
              this.initData()
              this.priceDig = false
            } else this.$message.error('添加失败')
          } else {
            let res = await this.$api.sso.putWaterPrice(this.priceForm)
            if (res.code === 200) {
              this.$message.success('修改成功')
              this.initData()
              this.priceDig = false
            } else this.$message.error('修改失败')
          }
        } else this.$message.error('请完善水价信息')
      })
    },
    async initData () {
      let res = await this.$api.sso.getWaterPrice()
      if (res.code === 200) {
        this.tableData = res.data.reverse()
      } else this.$message.error(res.message)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pbTop{
    margin: 4px 0 10px 0;
    display: flex;
    align-items: center;
    i{
      font-size: 16px!important;
      color: #4292FF;
      margin-right: 5px;
    }
    p{
      font-size: 14px;
      color: #4292FF;
      cursor: pointer;
    }
    p:hover{
      text-decoration: underline;
    }
  }
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
