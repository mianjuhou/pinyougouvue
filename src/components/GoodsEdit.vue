<template xmlns:v-quill="http://www.w3.org/1999/xhtml">
  <div>
    <div>商品基本信息</div>

    <el-tabs @tab-click="handleTabClick" v-model="activeName">
      <el-tab-pane label="商品基本信息" name="1">
        <el-card style="margin: 10px;">
          <el-form label-position="right" v-model="basicInfo" label-width="80px" size="small">
            <el-form-item label="商品分类">
              <div style="display: flex;">
                <el-cascader :props="props" v-model="cascaderModel" style="width: 300px;" @change="handleChange"></el-cascader>
                <div v-show="basicInfo.typeTemplateId.length!=0">模板ID:{{basicInfo.typeTemplateId}}</div>
              </div>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input placeholder="商品名称" v-model="basicInfo.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select v-model="basicInfo.brandId" placeholder="请选择" size="small">
                <el-option v-for="(brand) of brandsOption"
                           :value="brand.id"
                           :label="brand.text"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="副标题">
              <el-input placeholder="副标题" v-model="basicInfo.caption"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <div style="display: flex;">
                <el-tag>¥</el-tag>
                <el-input placeholder="价格" v-model="basicInfo.price"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="商品介绍" style="height: 300px;margin-bottom: 100px;">
              <quill-editor style="height: 300px;"
                            v-model="basicInfo.goodsDesc.introduction"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="onEditorBlur($event)"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady($event)">
              </quill-editor>
            </el-form-item>
            <el-form-item label="包装列表">
              <el-input type="textarea" placeholder="包装列表" v-model="basicInfo.goodsDesc.packageList"></el-input>
            </el-form-item>
            <el-form-item label="售后服务">
              <el-input type="textarea" placeholder="售后服务" v-model="basicInfo.goodsDesc.saleService"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item size="small">
              <el-button type="primary" @click="add">保存</el-button>
              <el-button @click="backList">返回列表</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="2">

        <el-button @click="addImgVis=true">新建</el-button>
        <el-table :data="imageDatas">
          <el-table-column label="颜色" prop="color"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <el-image :src="scope.row.url" fit="cover" style="width: 100px; height: 100px"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteImgs(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-divider></el-divider>
        <el-button type="primary" @click="saveImgs">保存</el-button>
        <el-button>返回列表</el-button>

        <el-dialog :visible.sync="addImgVis" title="上传商品图片">
          <el-form label-width="80px">
            <el-form-item label="颜色">
              <el-input v-model="imagePojo.color"></el-input>
            </el-form-item>
            <el-form-item label="商品图片">
              <div style="display: flex;align-items: center;flex-direction: row;">
                <div>
                  <input style="display: flex;align-items: center;" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                         @change="getFile"/>
                  <el-button size="mini" @click="submit" type="success">上传</el-button>
                </div>
                <div style="width: 200px;height: 200px;background-color: white;border: #8aa4af solid 1px;">
                  <el-image v-show="imagePojo.url != undefined && imagePojo.url.length != 0" :src="imagePojo.url"
                            style="width: 200px;height: 200px;"
                            fit="cover"></el-image>
                </div>
              </div>
            </el-form-item>
            <el-form-item style="text-align: right;">
              <el-button type="primary" @click="addSave">保存</el-button>
              <el-button @click="addCancel">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="扩展属性" name="3">
        <el-form label-width="80px">
          <el-form-item v-for="attr of attrItems" :label="attr.text">
            <el-input v-model="attr.value" size="small" :placeholder="attr.text"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item size="small">
            <el-button type="primary" @click="saveAttrs">保存</el-button>
            <el-button>返回列表</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="规格" name="4">
        <el-form label-width="80px;">
          <el-form-item label="是否启用规格">
            <el-checkbox v-model="basicInfo.isEnableSpec" :checked="basicInfo.isEnableSpec==1" true-label="1" false-label="0"></el-checkbox>
          </el-form-item>
          <div v-show="basicInfo.isEnableSpec==1">
            <el-form-item label-width="80px;" v-for="(spec) of specItems" :label="spec.text">
            <span v-for="option of spec.options">
              <input type="checkbox" name="spec.id" v-model="option.check" @change="optionChange(option)"/>{{option.optionName}}
            </span>
            </el-form-item>
            <el-table :data="this.basicInfo.items">
              <el-table-column v-for="item of basicInfo.goodsDesc.specificationItemsObj" :label="item.attributeName">
                <template slot-scope="scope">
                  {{scope.row.specObj[item.attributeName]}}
                </template>
              </el-table-column>
              <el-table-column label="价格" prop="price">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.price" placeholder="价格" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="库存" prop="num">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.num" placeholder="库存" size="small"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否启用">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.status" :checked="scope.row.status==1" true-label="1" false-label="0"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="是否默认">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isDefault" :checked="scope.row.isDefault==1" true-label="1" false-label="0"></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-divider></el-divider>
          <el-form-item size="small">
            <el-button type="primary" @click="addSaveSKU">保存</el-button>
            <el-button>返回列表</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {quillEditor} from 'vue-quill-editor';
  import goodsApi from '@/api/goods';
  import StringUtil from "@/utils/StringUtil";
  import itemCatApi from "@/api/itemCat";
  import typeTemplateApi from '@/api/typeTemplate';

  export default {
    name: "GoodsEdit",
    components: {
      quillEditor
    },
    data() {
      return {
        cascaderModel: [],
        activeName: '1',
        limit: 1,
        addImgVis: false,
        basicInfo: {goodsDesc: {}, typeTemplateId: ''},
        editorOption: {
          placeholder: '请输入商品介绍',
        },
        fileList: [],
        imageDatas: [],
        imagePojo: {},
        currentId: 0,
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            if (node.value == undefined || node.value == null) {
              node.value = 0;
            }
            const {level} = node;
            itemCatApi.findSearch({parentId: node.value})
              .then(response => {
                var ret = response.data;
                if (ret.flag) {
                  const nodes = ret.data.map(item => ({
                    value: item.id,
                    label: item.name,
                    leaf: level >= 2
                  }));
                  resolve(nodes);
                } else {
                  console.log(ret.message);
                }
              })
              .catch(error => {
                console.log(error);
              })
          }
        },
        brandsOption: [],
        attrItems: [],
        specItems: [],
        specArray: [],
        goodsId: null,
      }
    },
    created() {
      this.goodsId = this.$route.params.id;
      if (this.goodsId != undefined && this.goodsId != null) {
        this.loadData();
      }
    },
    watch: {},
    methods: {
      backList(){
        console.log(JSON.stringify(this.cascaderModel));
      },
      loadData() {
        goodsApi.findById(this.goodsId)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var preData = ret.data;
              preData.goodsDesc.specificationItemsObj = JSON.parse(preData.goodsDesc.specificationItems);
              this.imageDatas = JSON.parse(preData.goodsDesc.itemImages);
              this.attrItems = JSON.parse(preData.goodsDesc.customAttributeItems);
              this.cascaderModel.push(preData.category1Id);
              this.cascaderModel.push(preData.category2Id);
              this.cascaderModel.push(preData.category3Id);
              preData.items.forEach(item => {
                item.specObj = JSON.parse(item.spec);
              });
              this.basicInfo = ret.data;
            } else {
              console.log(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      addSaveSKU() {
        console.log(JSON.stringify(this.basicInfo));
      },
      optionChange() {
        //筛选出被选择的
        var attrArray = [];
        this.specItems.forEach(column => {
          var tempAttr = {attributeName: column.text, attributeValue: []};
          column.options.forEach(row => {
            if (row.check != undefined && row.check) {
              tempAttr.attributeValue.push(row.optionName);
            }
          });
          if (tempAttr.attributeValue.length > 0) {
            attrArray.push(tempAttr);
          }
        });
        this.basicInfo.goodsDesc.specificationItemsObj = attrArray;

        var specObjs = [];
        var specObj = {price: 0.0, num: 0, status: 0, isDefault: 1, specObj: {}};
        for (let i = 0; i < attrArray.length; i++) {
          var attr = attrArray[i];
          var attributeName = attr['attributeName'];
          var attributeValue = attr['attributeValue'];
          var tempArr = [];
          for (let j = 0; j < attributeValue.length; j++) {
            var attrItem = attributeValue[j];
            if (i == 0) {
              var obj = StringUtil.clone(specObj);
              obj.specObj[attributeName] = attrItem;
              tempArr.push(obj);
            } else {
              for (let k = 0; k < specObjs.length; k++) {
                var obj = StringUtil.clone(specObjs[k]);
                obj.specObj[attributeName] = attrItem;
                tempArr.push(obj);
              }
            }
          }
          specObjs = tempArr;
        }
        this.basicInfo.items = specObjs;
      },
      handleTabClick(tab, event) {
        if (tab.name == '4' && !StringUtil.isNumEmpty(this.basicInfo.typeTemplateId) && this.specItems.length <= 0) {
          //请求网络获取所有规格的选项
          typeTemplateApi.findSpecInfoById(this.basicInfo.typeTemplateId)
            .then(response => {
              var ret = response.data;
              if (ret.flag) {
                // 根据是否是修改界面改变选中状态
                ret.data.forEach(column => {
                  var text = column.text;
                  var attributeValue = [];
                  this.basicInfo.goodsDesc.specificationItemsObj.forEach(item => {
                    if (item.attributeName == text) {
                      attributeValue = item.attributeValue;
                    }
                  });
                  column.options.forEach(row => {
                    if (attributeValue.includes(row.optionName)) {
                      row.check = true;
                    }
                  })
                });
                this.specItems = ret.data;
              } else {
                console.log(ret.message)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      },
      saveAttrs() {
        this.basicInfo.goodsDesc.customAttributeItems = JSON.stringify(this.attrItems);
      },
      handleChange(value) {
        this.basicInfo.category1Id = value[0];
        this.basicInfo.category2Id = value[1];
        this.basicInfo.category3Id = value[2];
        itemCatApi.findById(value[2])
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.basicInfo.typeTemplateId = data.typeId;
              this.getTypeById(data.typeId);
            } else {
              console.log(ret.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      getTypeById(id) {
        typeTemplateApi.findById(id)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var data = ret.data;
              this.brandsOption = JSON.parse(data.brandIds);//获取品牌
              this.attrItems = JSON.parse(data.customAttributeItems);//获取自定义属性
            } else {
              console.log(ret.message)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteImgs(row, index) {
        goodsApi.deleteImage(row.url)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.$message.success(ret.message);
              this.imageDatas.splice(index, 1);
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      addCancel() {
        if (!StringUtil.isEmpty(this.imagePojo.url)) {
          goodsApi.deleteImage(this.imagePojo.url)
            .then(response => {
              var ret = response.data;
              console.log(ret.message)
            })
            .catch(error => {
              console.log(error)
            })
        }
        this.addImgVis = false;
      },
      addSave() {
        if (!StringUtil.isEmpty(this.imagePojo.url)) {
          this.imageDatas.push(this.imagePojo);
          this.addImgVis = false;
          this.imagePojo = {};
        } else {
          this.$message.warning("请添加图片");
        }
      },
      getFile(event) {
        this.fileList = [];
        this.fileList.push(event.target.files[0]);
      },
      submit() {
        let formData = new FormData();
        formData.append('file', this.fileList[0]);
        goodsApi.uploadImages(formData)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              var url = ret.data;
              this.imagePojo.url = url;
              this.$forceUpdate();
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      saveImgs() {
        if (this.imageDatas.length != 0) {
          this.basicInfo.goodsDesc.itemImages = JSON.stringify(this.imageDatas);
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      add() {
        // this.basicInfo.goodsDesc.specificationItems = JSON.stringify(this.basicInfo.goodsDesc.specificationItemsObj);
        // this.basicInfo.items.forEach(item => {
        //   item.spec = JSON.stringify(item.specObj);
        // });
        goodsApi.save(this.basicInfo)
          .then(response => {
            var ret = response.data;
            if (ret.flag) {
              this.basicInfo = {goodsDesc: {}};
              this.$message.success(ret.message);
            } else {
              this.$message.error(ret.message);
            }
          })
          .catch(error => {
            console.log(error);
          })
      },
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
    }
  }
</script>

<style scoped>

  #uploadImg {
    /*display: none;*/
  }

</style>
