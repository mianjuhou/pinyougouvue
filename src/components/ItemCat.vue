<template>
  <div>
    商品分类管理
    <div style="background-color: #8aa4af22;margin: 5px;padding: 10px;border-radius: 3px;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) of catLevel">
          <a @click="handlePreLevel(index)">{{item!=undefined?item.name:''}}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="padding: 15px;">
      <el-button-group>
        <el-button size="mini" @click="handleCreate">新建</el-button>
        <el-button size="mini" @click="handleDelete">删除</el-button>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
      </el-button-group>
    </div>

    <div>
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="catDatas">
        <el-table-column
          type="selection"
          width="55"></el-table-column>
        <el-table-column
          label="分类ID"
          prop="id"></el-table-column>
        <el-table-column
          label="分类名称"
          prop="name"></el-table-column>
        <el-table-column
          label="类型模板ID"
          prop="typeId"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleNextLevel(scope.$index, scope.row)" type="success">查询下级</el-button>
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
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>

    <el-dialog title="商品分类编辑" :visible.sync="createDialogVis">
      <div>
        <el-row>
          <el-col :span="8">上级商品分类</el-col>
          <el-col :span="16">
            <el-breadcrumb separator=">>" style="color: black;">
              <el-breadcrumb-item v-for="(item,index) of catLevel" v-show="!(index==0&&catLevel.length!=1)">
                <span>{{index==0?'无':item.name}}</span></el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">商品分类名称</el-col>
          <el-col :span="16">
            <el-input placeholder="商品分类名称" size="small" v-model="pojo.name"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="8">类型模板</el-col>
          <el-col :span="16">
            <el-input placeholder="商品类型模板" size="small" v-model="pojo.typeId"></el-input>
          </el-col>
        </el-row>
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
  import itemCatApi from "@/api/itemCat";

  export default {
    name: "ItemCat",
    data() {
      return {
        parentId: 0,
        pageSize: 10,
        totalSize: 0,
        currentPage: 1,
        catDatas: [],
        catLevel: [{id: 0, name: '顶级分类列表'}],
        createDialogVis: false,
        pojo: {},
        selectIds: new Set(),
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      saveOrUpdate() {
        this.pojo.parentId = this.catLevel[this.catLevel.length - 1].id;
        itemCatApi.save(this.pojo)
          .then(response => {
            let ret = response.data;
            this.createDialogVis = false;
            if (ret.flag) {
              this.$message.success(ret.message);
              this.loadData();
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handlePreLevel(index) {
        this.currentPage = 1;
        this.catLevel.splice(index + 1, 2);
        this.parentId = this.catLevel[index].id;
        var currentPage = this.catLevel[index].currentPage;
        itemCatApi.findPage(this.pageSize, currentPage, {parentId: this.parentId})
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.catDatas = data.rows;
              this.$nextTick(function () {
                this.currentPage = this.catLevel[index].currentPage;
              });
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleNextLevel(index, row) {
        this.parentId = row.id;
        this.catLevel[this.catLevel.length - 1].currentPage = this.currentPage;
        this.currentPage = 1;
        this.catLevel.push(row);
        this.loadData();
      },
      handleEdit(index, row) {
        this.pojo = row;
        this.createDialogVis = true;
      },
      handleSelectionChange(val) {
        val.forEach(select => {
          this.selectIds.add(select.id);
        });
        console.log(JSON.stringify(this.selectIds));
      },
      handleSizeChange(val) {
        this.pageSize = val;
        itemCatApi.findPage(this.pageSize, this.currentPage, {parentId: this.parentId})
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.catDatas = data.rows;
              //检测有没有选中的项
              this.$nextTick(function () {
                this.catDatas.forEach(cat => {
                  if (this.selectIds.has(cat.id)) {
                    this.$refs.multipleTable.toggleRowSelection(cat);
                  }
                });
              })
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        itemCatApi.findPage(this.pageSize, this.currentPage, {parentId: this.parentId})
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.catDatas = data.rows;
              //检测有没有选中的项
              this.$nextTick(function () {
                this.catDatas.forEach(cat => {
                  if (this.selectIds.has(cat.id)) {
                    this.$refs.multipleTable.toggleRowSelection(cat);
                  }
                });
              })
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      loadData() {
        itemCatApi.findPage(this.pageSize, this.currentPage, {parentId: this.parentId})
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.catDatas = data.rows;
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleCreate() {
        this.pojo = {};
        this.createDialogVis = true;
      },
      handleDelete() {
        this.$confirm('确认要删除' + JSON.stringify(this.selectIds) + "这几项及其子项吗？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          var ids = Array.from(this.selectIds);
          itemCatApi.deleteCascadeByIds(ids)
            .then(response => {
              var ret = response.data;
              if (ret.flag) {
                this.$message.success(ret.message);
                this.currentPage = 1;
                this.loadData();
              } else {
                this.$message.error(ret.message);
              }
            })
            .catch(error => {
              console.log(error);
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleRefresh() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>

</style>
