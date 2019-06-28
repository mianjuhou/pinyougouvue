<template>
  <div id="app">
    <router-link to="/brand">品牌</router-link>
    <router-link to="/specification">规格</router-link>
    <router-link to="/typetemplate">分类模板</router-link>
    <router-link to="/itemcat">商品分类</router-link>
    <router-link to="/goodsedit">新增商品</router-link>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
</style>
