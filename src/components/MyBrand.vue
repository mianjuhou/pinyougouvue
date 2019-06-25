<template>
  <div>
    <div>{{title}}</div>
<!--    <div>-->
<!--      <button @click="getBrands()">网络</button>-->
<!--    </div>-->
    <span>
      <button>新建</button>
      <button>删除</button>
      <button>刷新</button>
    </span>
    <table>
      <thead>
      <tr>
        <th>
          <input type="checkbox">
        </th>
        <th>品牌ID</th>
        <th>品牌名称</th>
        <th>品牌首字母</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) of datas">
        <td><input type="checkbox"></td>
        <td>{{item.id}}</td>
        <td>{{item.name}}</td>
        <td>{{item.first_char}}</td>
        <td>
          <button>修改</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import brandApi from '@/api/brand'
  import QS from 'qs';

  export default {
    name: "Brand",
    data() {
      return {
        title: "品牌管理",
        datas: []
      }
    },
    created() {
      this.getBrands();
    },
    methods: {
      getBrands() {
        var self = this;
        this.$axios.get("api/brand")
          .then(function (response) {
            var ret = QS.parse(response.data);
            self.datas = ret.data;
            console.log(ret);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      getBrand(id) {
        this.$axios.get("api/brand/" + id)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      postBrands() {
        this.$axios.post("api/brand")
          .then(function (response) {
            console.log(response);
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
