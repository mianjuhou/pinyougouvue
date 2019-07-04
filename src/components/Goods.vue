<template>
  <div>
    <div>商品管理</div>
    <el-divider></el-divider>
    <el-row style="padding-left: 10px;padding-right: 10px;">
      <el-col :span="12">
        <el-button-group>
          <el-button size="small">新建</el-button>
          <el-button size="small">删除</el-button>
          <el-button size="small">提交审核</el-button>
          <el-button size="small">屏蔽</el-button>
          <el-button size="small">刷新</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" style="text-align: right;">
        <span>状态：</span>
        <el-select size="mini" style="width: 100px;" v-model="pojo.auditStatus">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(value,key,index) of auditStatusMap" :label="value" :value="key"></el-option>
        </el-select>
        <span>商品名称：</span>
        <el-input style="width: 200px;" size="mini" v-model="pojo.goodsName"></el-input>
        <el-button size="mini" @click="conditionSearch">查询</el-button>
      </el-col>
    </el-row>
    <!-- 商品ID	商品名称	商品价格	一级分类	二级分类	三级分类	状态	操作 -->
    <el-table :data="datas" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="商品ID" prop="id"></el-table-column>
      <el-table-column label="商品名称" prop="goodsName"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="一级分类" prop="category1Id" :formatter="catFormatter"></el-table-column>
      <el-table-column label="二级分类" prop="category2Id" :formatter="catFormatter"></el-table-column>
      <el-table-column label="三级分类" prop="category3Id" :formatter="catFormatter"></el-table-column>
      <el-table-column label="状态" prop="auditStatus" :formatter="auditStatusFormatter"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="goodsEdit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import goodsApi from '@/api/goods';
  import itemCatApi from '@/api/itemCat';

  export default {
    name: "Goods",
    data() {
      return {
        pojo: {auditStatus: ''},
        total: 0,
        pageSize: 10,
        pageNum: 1,
        datas: [],
        auditStatusMap: {0: '未申请', 1: '审核通过', 2: '审核未通过', 3: '已关闭'},
        catDatas: null,
      }
    },
    created() {
      this.loadCatData();
    },
    methods: {
      goodsEdit(row) {
        this.$router.push({name: 'GoodsEdit', params: {id: row.id}});
      },
      catFormatter(row, column) {
        return this.catDatas[row[column.property]];
      },
      auditStatusFormatter(row, column) {
        return this.auditStatusMap[row.auditStatus];
      },
      conditionSearch() {
        this.pageNum = 1;
        this.loadData();
      },
      handleSelectionChange(val) {

      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.loadData();
      },
      loadData() {
        goodsApi.findPage(this.pageSize, this.pageNum, this.pojo)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var wrapper = ret.data;
              this.total = wrapper.total;
              this.datas = wrapper.rows;
            } else {
              console.log(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      loadCatData() {
        itemCatApi.findAll()
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var catList = ret.data;
              this.catDatas = {};
              catList.forEach(cat => {
                this.catDatas[cat.id] = cat.name;
              });
              this.loadData();
            } else {
              console.log(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
</script>

<style scoped>

</style>
