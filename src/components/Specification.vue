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
            <el-button size="mini" @click="handleRefresh">刷新</el-button>
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
          prop="specName"></el-table-column>
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
            <el-input v-model="currentSpecData.specName" placeholder="规格名称" size="small"></el-input>
          </el-col>
        </el-row>
        <el-button style="margin-top: 10px;" size="small" @click="handlOptionAdd">新增规格选项</el-button>
        <el-row>
          <el-col :span="10">规格选项</el-col>
          <el-col :span="10">排序</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <div style="max-height: 200px;overflow-y: auto;">
          <el-row v-for="(item,index) of currentSpecData.options" :key="index">
            <el-col :span="10" style="padding: 5px;">
              <input v-model="item.optionName" placeholder="规格选项"></input>
            </el-col>
            <el-col :span="10" style="padding: 5px;">
              <input v-model="item.orders" placeholder="排序"></input>
            </el-col>
            <el-col :span="4" style="padding: 5px;">
              <el-button size="mini" @click="handleOptionDelete(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <el-row type="flex" justify="end">
          <el-button type="success" @click="saveOrUpdate">保存</el-button>
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
              this.currentSpecData.options = ret.data;
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
        this.currentSpecData = {options: []};
        this.createDialogVis = true;
      },
      handleDelete() {
        specificationApi.deleteAll(this.selectSpecId)
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
      handleRefresh() {
        this.loadData();
      },
      handleOptionDelete(index) {
        this.currentSpecData.options.splice(index, 1);
      },
      handlOptionAdd() {
        this.currentSpecData.options.push({optionName: '', orders: ''});
        this.$forceUpdate();
      },
      saveOrUpdate() {
        //规格名称不能为空
        var specName = this.currentSpecData.specName;
        if (specName == undefined || specName == null || specName.length == 0) {
          this.$message.error("规格名称不能为空");
          return;
        }
        //自动补全序号
        var options = this.currentSpecData.options;
        if (options != undefined || options != null) {
          var noOrderArr = [];
          var maxOrder = 0;
          for (let i = 0; i < options.length; i++) {
            var orderNo = options[i].orders;
            if (orderNo == undefined || orderNo == null || orderNo.length <= 0) {
              noOrderArr.push(options[i]);
            } else {
              if (orderNo > maxOrder) {
                maxOrder = orderNo;
              }
            }
          }
          for (let i = 0; i < noOrderArr.length; i++) {
            maxOrder++;
            noOrderArr[i].orders = maxOrder;
          }
        }
        //根据是否有ID判断是新增还是更新
        var id = this.currentSpecData.id;
        if (id == undefined || id == null || id.length == 0) {
          specificationApi.saveAll(this.currentSpecData)
            .then(response => {
              var ret = response.data;
              if (ret.flag) {
                this.createDialogVis = false;
                this.$message({message: ret.message, type: 'success'})
                this.loadData();
              } else {
                this.$message.error(ret.message);
              }
            })
            .catch(error => {
              this.createDialogVis = false;
              this.$message.error(error);
            })
        } else {
          specificationApi.updateAll(id, this.currentSpecData)
            .then(response => {
              var ret = response.data;
              if (ret.flag) {
                this.createDialogVis = false;
                this.$message({message: ret.message, type: 'success'})
                this.loadData();
              } else {
                this.$message.error(ret.message);
              }
            })
            .catch(error => {
              this.createDialogVis = false;
              this.$message.error(error);
            })
        }
      },
    }
  }
</script>

<style scoped>

</style>
