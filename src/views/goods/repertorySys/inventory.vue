<template>
  <!-- 库存盘点 -->
  <div class="inner">
    <!-- 头部 -->
    <div class="header">
      <el-form :inline="true"
        :model="form"
        label-width="100px"
        label-position="left">
        <el-form-item label="所属仓库"
          label-width="70px">
          <el-select v-model="form.warehouseName"
            clearable
            placeholder="请选择">
            <el-option v-for="item in whouseName "
              :key="item.id"
              :label="item.whouseName"
              :value="item.whouseName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery('query')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 中间内容 -->
    <div class="box">
      <div class="boxContent">
        <el-table :data="tableData"
          stripe
          class="tables"
          border
          :header-cell-style="tableHeaderColor">
          <el-table-column label="序号"
            align="center"
            width="50">
            <template slot-scope="scope">
              <span>{{(page-1)*limit+scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName"
            label="产品名称"
            align="center"></el-table-column>
          <el-table-column prop="productclassifi"
            label="产品分类"
            align="center"></el-table-column>
          <el-table-column prop="productspec"
            label="产品规格"
            align="center"></el-table-column>
          <el-table-column prop="productCompany"
            label="单位"
            align="center"></el-table-column>
          <el-table-column prop="warehouseName"
            label="所存仓库"
            align="center"></el-table-column>
          <el-table-column prop="makesysNum"
            label="系统数量"
            align="center"></el-table-column>
          <el-table-column prop="makeentoryNum"
            label="盘点数量"
            align="center"></el-table-column>
          <el-table-column prop="makePeople"
            label="盘点人"
            align="center"></el-table-column>
          <el-table-column prop="makeTime"
            :formatter='formatter'
            label="盘点时间"
            align="center"></el-table-column>
          <el-table-column prop="makeRemarks"
            label="备注"
            align="center"></el-table-column>
          <el-table-column label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" plain round size="mini"
                v-has="{type: 'checkStock'}"
                @click="handleRevise(scope.row)">核对库存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChanges"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 弹窗修改删除 -->
    <el-dialog :title="dialogTitle"
      :visible.sync="dialog"
      width="45%"
      center>
      <el-form :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="left">
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="产品名称"
              :label-width='lableWidth'
              prop="productName">
              <el-select v-model="ruleForm.productName"
                disabled
                placeholder="请选择">
                <el-option v-for="item in productNameData "
                  :key="item.id"
                  :label="item.productName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="产品规格"
              :label-width='lableWidth'
              prop="productspec">
              <el-input v-model="ruleForm.productspec"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="单位"
              :label-width='lableWidth'
              prop="productCompany">
              <el-input v-model="ruleForm.productCompany"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="产品分类"
              :label-width='lableWidth'
              prop="productclassifi">
              <el-input v-model="ruleForm.productclassifi"
                disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="系统数量"
              :label-width='lableWidth'
              prop="makesysNum">
              <el-input v-model.number="ruleForm.makesysNum"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="盘点数量"
              :label-width='lableWidth'
              prop="makeentoryNum">
              <el-input v-model.number="ruleForm.makeentoryNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row type="flex"
          justify="space-between">
          <el-col :span='11'>
            <el-form-item label="盘点人"
              :label-width='lableWidth'
              prop="makePeople">
              <el-input v-model="ruleForm.makePeople"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label="盘点时间"
              :label-width='lableWidth'
              prop="makeTime">
              <el-date-picker v-model="ruleForm.makeTime"
                value-format="timestamp"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row type="flex"
          justify="space-between">
          <el-col :span='24'>
            <el-form-item label="备注"
              :label-width='lableWidth'
              prop="makeRemarks">
              <el-input v-model="ruleForm.makeRemarks"
                type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-row type="flex"
          justify="end">
          <el-col :span="8">
            <el-button @click="dialog = false">取 消</el-button>
            <el-button type="primary"
              @click="handleSumbit('ruleForm')">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setTime from '@/assets/js/setTime'
export default {
  name: 'receives',
  data () {
    return {
      tableData: [],
      total: 0,
      limit: 10,
      page: 1,
      ruleForm: {
        id: '',
        productName: '',
        productspec: '',
        productCompany: '',
        productclassifi: '',
        makesysNum: '',
        makeentoryNum: '',
        // makePeople: '',
        // makeTime: '',
        makeRemarks: ''
      },
      form: {
        warehouseName: ''
      },
      rules: {
        makeentoryNum: [{ required: true, message: '请输入盘点数量', trigger: 'change' }],
        makePeople: [{ required: true, message: '请输入盘点人', trigger: 'change' }],
        makeTime: [{ required: true, message: '请选择盘点时间', trigger: 'change' }]
      },
      dialog: false,
      // 弹窗名字
      dialogTitle: '核对库存',
      lableWidth: '95px',
      // 获取所有产品名称
      productNameData: [],
      // 所有仓库名称
      whouseName: []
    }
  },
  methods: {
    formatter (row, column, cellValue) {
      if (cellValue) {
        return setTime({ date: cellValue, number: 1000, type: 2 })
      } else {
        return '暂无数据'
      }
    },
    handleQuery (val) {
      this.initdata(val)
    },
    initdata (val) {
      val === 'query' ? this.page = 1 : this.page = this.page
      this.$api.inventory.getList({ pageNum: this.page, pageSize: this.limit, warehouseName: this.form.warehouseName }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取所有仓库
      this.$api.warehousing.getWarehouse().then(res => {
        if (res.code === 200) {
          this.whouseName = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改按钮
    handleRevise (val) {
      this.dialogTitle = '核对库存'
      this.dialog = true
      // 根据id查数据
      this.$api.inventory.findById({ id: val.id }).then(res => {
        if (res.code === 200) {
          this.ruleForm = res.data
          // if (this.ruleForm.makeTime === undefined) {
          // } else {
          //   this.ruleForm.makeTime = this.ruleForm.makeTime * 1000
          // }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 表头样式改变
    tableHeaderColor ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #dae9ff;color: #282d4d;font-weight: 700;border-color:#dae9ff'
      }
    },
    // 添加管理员提交
    handleSumbit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let { id, productName, productspec, productCompany, productclassifi, makesysNum, makeentoryNum, makeRemarks, warehouseName } = this.ruleForm
          // makeTime = makeTime / 1000
          // 修改
          let obj = { id, productName, productspec, productCompany, productclassifi, makesysNum, makeentoryNum, makeRemarks, warehouseName }
          this.$api.inventory.update(obj).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.dialog = false
              this.initdata()
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('请完善信息')
          return false
        }
      })
    },
    // 改变每页显示条数
    handleSizeChange (val) {
      this.limit = val
      this.initdata()
    },
    // 改变页码
    handleCurrentChanges (val) {
      this.page = val
      this.initdata()
    },
    // 表单重置
    resetForm () {
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
    }
  },
  mounted () {
    this.initdata()
  },
  watch: {
    dialog (a, b) {
      if (!a) {
        this.resetForm()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 62px;
}
// .inner /deep/ .el-dialog__body {
//   padding: 25px 60px 10px !important;
// }
.el-select {
  width: 100%;
}
.demo-ruleForm .el-date-editor {
  width: 100%;
}
.dialog-footer .el-button {
  margin: 0 0 0 10px !important;
  float: right;
}
.inner /deep/ .el-dialog__footer {
  padding: 10px 60px 40px !important;
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
    .tables {
      margin-bottom: 20px;
    }
  }
}
</style>
