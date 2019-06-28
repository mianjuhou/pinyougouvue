<template>
  <div>
    <div>
      商品类型模板管理
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
          <span>分类模板名称:</span>
          <el-input size="mini" style="width: 200px;" v-model="searchPojo.name"></el-input>
          <el-button size="mini" @click="loadData">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table @selection-change="handleSelectionChange" :data="templateDatas">
        <el-table-column
          type="selection"
          width="55"></el-table-column>
        <el-table-column
          label="模板ID"
          prop="id"></el-table-column>
        <el-table-column
          label="分类模板名称"
          prop="name"></el-table-column>
        <el-table-column
          label="关联品牌"
          prop="brandIds"
          :formatter="brandFormatter"></el-table-column>
        <el-table-column
          label="关联规格"
          prop="specIds"
          :formatter="specFormatter"></el-table-column>
        <el-table-column
          label="扩展属性"
          prop="customAttributeItems"
          :formatter="customFormatter"></el-table-column>
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
    <el-dialog title="商品类型模板编辑" :visible.sync="createDialogVis">
      <div>
        <el-row>
          <el-col :span="4">商品类型</el-col>
          <el-col :span="20">
            <input v-model="currentCreateData.name" placeholder="商品类型"></input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">关联品牌</el-col>
          <el-col :span="20">
            <el-select placeholder="关联品牌" v-model="selectBrands" multiple size="mini" style="width: 100%;">
              <el-option
                v-for="(item,index) of brandOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">关联规格</el-col>
          <el-col :span="20">
            <el-select placeholder="关联规格" v-model="selectSpecs" multiple size="mini" style="width: 100%;">
              <el-option
                v-for="(item,index) of specOptions"
                :key="index"
                :label="item.specName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">扩展属性</el-col>
          <el-col :span="20">
            <div>
              <div>
                <el-button size="mini" @click="customOptions.push({text:''})">新增扩展属性</el-button>
              </div>
              <el-row>
                <el-col :span="16">属性名称</el-col>
                <el-col :span="8">操作</el-col>
              </el-row>
              <el-row v-for="(item,index) of customOptions">
                <el-col :span="16"><input v-model="item.text"></input></el-col>
                <el-col :span="8">
                  <el-button size="mini" @click="customOptions.splice(index,1)">删除</el-button>
                </el-col>
              </el-row>
            </div>
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
  import typeTemplateApi from "@/api/typeTemplate";
  import brandApi from "@/api/brand";
  import specificationApi from "@/api/specification";

  export default {
    name: "TypeTemplate",
    created() {
      this.loadData();
    },
    data() {
      return {
        totalSize: 0,
        currentPage: 1,
        pageSize: 100,
        templateDatas: [],
        createDialogVis: false,
        selectBrands: [],
        selectSpecs: [],
        brandOptions: [],
        specOptions: [],
        customOptions: [],
        currentCreateData: {},
        selectTemplateIds: [],
        searchName: '',
        searchPojo: {}
      }
    },
    methods: {
      searchTemplate() {
        this.loadData();
      },
      saveOrUpdate() {
        var specArr = [];
        this.specOptions.forEach(spec => {
          if (this.selectSpecs.includes(spec.id)) {
            specArr.push({
              id: spec.id,
              text: spec.specName
            });
          }
        })
        var brandArr = [];
        this.brandOptions.forEach(brand => {
          if (this.selectBrands.includes(brand.id)) {
            brandArr.push({
              id: brand.id,
              text: brand.name
            });
          }
        })
        this.currentCreateData.specIds = JSON.stringify(specArr);
        this.currentCreateData.brandIds = JSON.stringify(brandArr);
        this.currentCreateData.customAttributeItems = JSON.stringify(this.customOptions);
        typeTemplateApi.save(this.currentCreateData)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.createDialogVis = false;
              this.$message({message: ret.message, type: 'success'});
              this.loadData();
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      brandFormatter(row, column) {
        var stringBrand = '';
        var brands = JSON.parse(row.brandIds);
        for (let i = 0; i < brands.length; i++) {
          var brand = brands[i];
          stringBrand += brand.text + ",";
        }
        if (stringBrand.length > 0) {
          return stringBrand.substring(0, stringBrand.length - 1);
        } else {
          return "";
        }
      },
      specFormatter(row, column) {
        var stringSpec = '';
        var specs = JSON.parse(row.specIds);
        for (let i = 0; i < specs.length; i++) {
          var spec = specs[i];
          stringSpec += spec.text + ",";
        }
        if (stringSpec.length > 0) {
          return stringSpec.substring(0, stringSpec.length - 1);
        } else {
          return "";
        }
      },
      customFormatter(row, column) {//customAttributeItems
        var stringCustom = '';
        var customs = JSON.parse(row.customAttributeItems);
        for (let i = 0; i < customs.length; i++) {
          var custom = customs[i];
          stringCustom += custom.text + ",";
        }
        if (stringCustom.length > 0) {
          return stringCustom.substring(0, stringCustom.length - 1);
        } else {
          return "";
        }
      },
      loadData() {
        typeTemplateApi.findPage(this.pageSize, this.currentPage,this.searchPojo)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.totalSize = data.total;
              this.templateDatas = data.rows;
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      handleCreate() {
        this.$axios.all([brandApi.findAll(), specificationApi.findAll()])
          .then(this.$axios.spread((brandResp, specResp) => {
            var brandRet = brandResp.data;
            var specRet = specResp.data;
            if (brandRet.flag && specRet.flag) {
              this.brandOptions = brandRet.data;
              this.specOptions = specRet.data;
              this.createDialogVis = true;
            } else {
              this.$message.error(brandRet.message + "--" + specRet.message);
            }
          }))
          .catch(error => {
            console.log(error);
          })
      },
      handleDelete() {
        typeTemplateApi.deleteAll(this.selectTemplateIds)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.$message({message: ret.message, type: 'success'});
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

      },
      handleEdit(index, row) {
        this.$axios.all([brandApi.findAll(), specificationApi.findAll()])
          .then(this.$axios.spread((brandResp, specResp) => {
            var brandRet = brandResp.data;
            var specRet = specResp.data;
            if (brandRet.flag && specRet.flag) {
              this.brandOptions = brandRet.data;
              this.specOptions = specRet.data;
              this.createDialogVis = true;

              var brands = JSON.parse(row.brandIds);
              this.selectBrands = [];
              for (let i = 0; i < brands.length; i++) {
                this.selectBrands.push(brands[i].id);
              }
              var specs = JSON.parse(row.specIds);
              this.selectSpecs = [];
              for (let i = 0; i < specs.length; i++) {
                this.selectSpecs.push(specs[i].id);
              }
              this.customOptions = JSON.parse(row.customAttributeItems);
              this.currentCreateData.name = row.name;
              this.currentCreateData.id = row.id;
            } else {
              this.$message.error(brandRet.message + "--" + specRet.message);
            }
          }))
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
        this.selectTemplateIds = [];
        val.forEach(template => {
          this.selectTemplateIds.push(template.id);
        });
      },
    }
  }
</script>

<style scoped>

</style>
