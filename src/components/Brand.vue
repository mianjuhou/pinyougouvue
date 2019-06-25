<template>
  <div>
    <div class="box-header with-border">
      <h3 class="box-title">品牌管理</h3>
    </div>
    <div class="box-body">

      <!-- 数据表格 -->
      <div class="table-box">

        <!--工具栏-->
        <div class="pull-left">
          <div class="form-group form-inline">
            <div class="btn-group">
              <button type="button" class="btn btn-default" title="新建" data-toggle="modal" data-target="#editModal" @click="handleCreate"><i
                class="fa fa-file-o"></i> 新建
              </button>
              <button type="button" class="btn btn-default" title="删除" @click="deleteById"><i class="fa fa-trash-o"></i> 删除</button>
              <button type="button" class="btn btn-default" title="刷新" onclick="window.location.reload();"><i class="fa fa-refresh"></i> 刷新
              </button>
            </div>
          </div>
        </div>
        <div class="box-tools pull-right">
          <el-row :gutter="10">
            <el-col :span="9">
              <el-input v-model="searchName" placeholder="品牌名称" size="small"></el-input>
            </el-col>
            <el-col :span="9">
              <el-input v-model="searchFirstChar" placeholder="品牌首字母" size="small"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click="findPage" size="small">搜索</el-button>
            </el-col>
          </el-row>
        </div>
        <!--工具栏/-->
        <!--数据列表-->
        <table id="dataList" class="table table-bordered table-striped table-hover dataTable">
          <thead>
          <tr>
            <th class="" style="padding-right:0px">
              <input id="selall" type="checkbox" class="icheckbox_square-blue">
            </th>
            <th class="sorting_asc">品牌ID</th>
            <th class="sorting">品牌名称</th>
            <th class="sorting">品牌首字母</th>
            <th class="text-center">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) of datas">
            <td><input type="checkbox" v-model="item.checked"></td>
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.first_char}}</td>
            <td class="text-center">
              <button type="button" class="btn bg-olive btn-xs" data-toggle="modal" data-target="#editModal" @click="handleEdit(item)">修改
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <!--数据列表/-->
        <!--分页插件-->
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <!-- 数据表格 /-->
    </div>
    <!-- 编辑窗口 -->
    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="myModalLabel">品牌编辑</h3>
          </div>
          <div class="modal-body">
            <table class="table table-bordered table-striped" width="800px">
              <tr>
                <td>品牌名称</td>
                <td><input class="form-control" placeholder="品牌名称" v-model="pojo.name"></td>
              </tr>
              <tr>
                <td>首字母</td>
                <td><input class="form-control" placeholder="首字母" v-model="pojo.first_char"></td>
              </tr>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" data-dismiss="modal" aria-hidden="true" @click="handleSave">保存</button>
            <button class="btn btn-default" data-dismiss="modal" aria-hidden="true">关闭</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import brandApi from '@/api/brand'
  import '../assets/css/style.css';
  import '../assets/plugins/adminLTE/css/AdminLTE.css';
  import '../assets/plugins/adminLTE/css/skins/_all-skins.min.css';


  export default {
    name: "Brand",
    data() {
      return {
        title: "品牌管理",
        datas: [],
        pojo: {},
        searchName: '',
        searchFirstChar: '',
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      this.findPage(this.pageSize, this.currentPage);
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.findPage();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.findPage();
      },
      handleCreate() {
        this.pojo = {};
      },
      handleEdit(item) {
        this.pojo = item;
        console.log(item.checked)
      },
      handleSave() {
        if (this.pojo.id == undefined) {
          this.save();
        } else {
          this.update()
        }
      },
      save() {
        var self = this;
        brandApi.save(this.pojo)
          .then(function (response) {
            var ret = self.$QS.parse(response.data);
            if (ret.flag) {
              //刷新页面
              self.findAll();
            }
            alert(ret.message);
          });
      },
      deleteById() {
        var ids = [];
        for (let i = 0; i < this.datas.length; i++) {
          var data = this.datas[i];
          if (data.checked) {
            ids.push(data.id);
          }
        }
        var self = this;
        if (ids.length == 0) {
          return;
        } else if (ids.length == 1) {
          brandApi.deleteById(ids[0])
            .then(function (response) {
              var ret = self.$QS.parse(response.data);
              if (ret.flag) {
                self.findAll();
              }
              alert(ret.message);
            });
        } else {
          brandApi.deleteByIds(ids)
            .then(function (response) {
              var ret = self.$QS.parse(response.data);
              if (ret.flag) {
                //刷新页面
                self.findAll();
              }
              alert(ret.message);
            });
        }
      },
      update() {
        brandApi.update(this.pojo.id, this.pojo)
          .then(function (response) {
            var ret = response.data;
            alert(ret.message);
          });
      },
      findAll() {
        var self = this;
        brandApi.findAll()
          .then(function (response) {
            // var ret = self.$QS.parse(response.data);
            var ret = response.data;
            self.datas = ret.data;
            console.log(ret);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      findPage() {
        var self = this;
        brandApi.findPage(this.pageSize, this.currentPage, {name: this.searchName, first_char: this.searchFirstChar})
          .then(function (response) {
            var wrapper = self.$QS.parse(response.data);
            if (wrapper.flag) {
              self.total = wrapper.data.total;
              self.datas = wrapper.data.rows;
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    }
  }
</script>

<style scoped>
</style>
