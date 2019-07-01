<template xmlns:v-quill="http://www.w3.org/1999/xhtml">
  <div>
    <div>商品基本信息</div>

    <el-tabs>
      <el-tab-pane label="商品基本信息">
        <el-card style="margin: 10px;">
          <el-form label-position="right" v-model="basicInfo" label-width="80px" size="small">
            <el-form-item label="商品分类">

            </el-form-item>
            <el-form-item label="商品名称">
              <el-input placeholder="商品名称" v-model="basicInfo.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">

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
              <el-button>返回列表</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="商品图片">

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
      <el-tab-pane label="扩展属性">

      </el-tab-pane>
      <el-tab-pane label="规格">

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

  export default {
    name: "GoodsEdit",
    components: {
      quillEditor
    },
    data() {
      return {
        limit: 1,
        addImgVis: false,
        basicInfo: {goodsDesc: {}},
        editorOption: {
          placeholder: '请输入商品介绍',
        },
        fileList: [],
        imageDatas: [],
        imagePojo: {}
      }
    },
    created() {

    },
    methods: {
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
