<template>
  <div id="app">
    <router-link to="/">Hello</router-link>
    <router-link to="/mybrand">我的品牌</router-link>
    <router-link to="/brand">品牌</router-link>
    <router-link to="/specification">规格</router-link>
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
