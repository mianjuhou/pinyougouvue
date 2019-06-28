<template xmlns:v-quill="http://www.w3.org/1999/xhtml">
  <div>
    <div>商品基本信息</div>
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
        <el-form-item size="small">
          <el-button type="primary" @click="add">保存</el-button>
          <el-button>返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {quillEditor} from 'vue-quill-editor';
  import goodsApi from '@/api/goods';

  export default {
    name: "GoodsEdit",
    components: {
      quillEditor
    },
    data() {
      return {
        basicInfo: {goodsDesc: {}},
        editorOption: {
          placeholder: '请输入商品介绍',
        },
      }
    },
    created() {

    },
    methods: {
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

</style>
