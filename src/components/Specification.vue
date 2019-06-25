<template>
  <div>
    <div>
      规格管理
    </div>
    <div style="padding-left: 5px;padding-right: 5px;">
      <el-row>
        <el-col :span="12">
          <el-button-group>
            <el-button size="mini" @click="handleCreate">新建</el-button>
            <el-button size="mini" @click="handleDelete">删除</el-button>
            <el-button size="mini">刷新</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <span>规格名称:</span>
          <el-input size="mini" style="width: 200px;"></el-input>
          <el-button size="mini">查询</el-button>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table @selection-change="handleSelectionChange" :data="specDatas">
        <el-table-column
          type="selection"
          width="55"></el-table-column>
        <el-table-column
          label="规格ID"
          align="center"
          prop="id"></el-table-column>
        <el-table-column
          label="规格名称"
          align="center"
          prop="spec_name"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="success">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>

    <!-- 新建窗口 -->
    <el-dialog title="规格编辑" :visible.sync="createDialogVis">
      <div>
        <el-row>
          <el-col :span="6">规格名称</el-col>
          <el-col :span="18">
            <el-input v-model="currentSpecData.spec_name" placeholder="规格名称" size="small"></el-input>
          </el-col>
        </el-row>
        <el-button style="margin-top: 10px;" size="small" @click="handlOptionAdd">新增规格选项</el-button>
        <el-row>
          <el-col :span="10">规格选项</el-col>
          <el-col :span="10">排序</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <div style="max-height: 200px;overflow-y: auto;">
          <el-row v-for="(item,index) of currentSpecData.option" :key="index">
            <el-col :span="10" style="padding: 5px;">
              <input v-model="item.option_name" placeholder="规格选项"></input>
            </el-col>
            <el-col :span="10" style="padding: 5px;">
              <input v-model="item.orders" placeholder="排序"></input>
            </el-col>
            <el-col :span="4" style="padding: 5px;">
              <el-button size="mini" @click="handleOptionDelete">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <el-row type="flex" justify="end">
          <el-button type="success" @click="optionSave">保存</el-button>
          <el-button @click="createDialogVis=false">关闭</el-button>
        </el-row>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import specificationApi from '@/api/specification'
  import specificationOptionApi from '@/api/specificationOption'

  export default {
    name: "Specification",
    data() {
      return {
        specDatas: [],
        currentSpecData: {},
        totalSize: 0,
        currentPage: 1,
        pageSize: 100,
        createDialogVis: false,
        selectSpecId: [],
      }
    },
    created() {
      this.loadData(10, this.currentPage);
    },
    methods: {
      loadData() {
        specificationApi.findPage(this.pageSize, this.currentPage)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.specDatas = data.rows;
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      loadOptionData() {
        var specId = this.currentSpecData.id;
        specificationOptionApi.findBySpedId(specId)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.currentSpecData['option'] = ret.data;
              this.createDialogVis = true;
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.loadData();
      },
      handleSelectionChange(val) {
        this.selectSpecId = [];
        val.forEach(spec => {
          this.selectSpecId.push(spec.id);
        });
        console.log(JSON.stringify(this.selectSpecId));
      },
      handleEdit(index, row) {
        console.log(index, JSON.stringify(row));
        this.currentSpecData = row;
        this.loadOptionData();
      },
      handleCreate() {
        this.currentSpecData = {};
        this.createDialogVis = true;
      },
      handleDelete() {
        specificationApi.deleteByIds(this.selectSpecId)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.$message({message: ret.message, type: 'success'})
              this.loadData();
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleOptionDelete(index, row) {
        specificationOptionApi.deleteById(row.id)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.currentSpecData['option'] = ret.data;
              this.$message({message: ret.message, type: 'success'})
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handlOptionAdd() {
        console.log(this.currentSpecData.option.length);
        this.currentSpecData.option.push({option_name: '', orders: ''});
        console.log(this.currentSpecData.option.length);
        this.$forceUpdate();
      },
      optionSave() {//保存规格选项，多个选项，有可能没有序号，ID，服务端判断处理
        //名称不能为空
        if (this.currentSpecData.option === undefined || this.currentSpecData.option == null) {
          return;
        }
        for (let i = 0; i < this.currentSpecData.option.length; i++) {
          var name = this.currentSpecData.option[i].option_name;
          if (name == undefined || name == null || name.length == 0) {
            this.$message.error("规格选项不能为空");
            return;
          }
        }
        specificationOptionApi.saveAll(this.currentSpecData)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.createDialogVis = false;
              this.$message({message: ret.message, type: 'success'})
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            this.createDialogVis = false;
            console.log(error);
          })
      }
    }
  }
</script>

<style scoped>

</style>
