<template>
  <div id="app" style="display: flex;width: 100%;height: 100%;">
    <div style="flex: 1;display: flex;">
      <div style="flex-shrink: 0;background-color: #545c64;display: flex;flex-direction: column;">
        <div style="flex-shrink: 0;">
          <div style="height: 60px;background-color: #107D3B;color: white;display: flex;align-items: center;justify-content: center;">
            <span :style="isCollapse?'font-size: 15px':'font-size: 25px'">品优购</span>
          </div>
          <div style="padding: 10px;color: white;display: flex;">
            <el-image src="http://172.16.200.168/group1/M00/00/00/rBDIqF0cBbaABIg-AAFH8mTeDP421.jpeg"
                      :class="isCollapse?'u-img-class':'s-img-class'"></el-image>
            <div v-show="!isCollapse" style="display: flex;flex-direction: column;justify-content: center;padding-left: 10px;">
              <div><strong>测试用户</strong></div>
              <div style="margin-top: 5px;font-size: 12px;">在线</div>
            </div>
          </div>
          <div style="background-color: #141A1D;color: #718A96;font-size: 12px;padding: 10px;">
            菜单
          </div>
        </div>
        <div style="overflow-y: auto;">
          <el-menu
            :collapse="isCollapse"
            class="el-menu-vertical"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#718A96"
            active-text-color="#fff">
            <el-menu-item index="FirstView">
              <i class="el-icon-location"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>商家管理</span>
              </template>
              <el-menu-item>商家审核</el-menu-item>
              <el-menu-item>商家管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>品牌管理</span>
              </template>
              <el-menu-item index="Brand">品牌管理</el-menu-item>
              <el-menu-item index="Specification">规格管理</el-menu-item>
              <el-menu-item index="TypeTemplate">模板管理</el-menu-item>
              <el-menu-item index="ItemCat">分类管理</el-menu-item>
              <el-menu-item>商品审核</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>广告管理</span>
              </template>
              <el-menu-item>广告类型管理</el-menu-item>
              <el-menu-item>广告管理</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="GoodsEdit">新增商品</el-menu-item>
              <el-menu-item index="Goods">商品管理</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>基本管理</span>
              </template>
              <el-menu-item>修改资料</el-menu-item>
              <el-menu-item>修改密码</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

      </div>
      <div style="flex-grow: 1;display: flex;flex-direction: column;">
        <el-row style="height: 50px;background-color: #42b983">
          <el-col :span="12" style="display: flex;flex-direction: row;align-items: center;">
            <div style="height: 50px;width: 80px;display: flex;align-items: center;justify-content: center;color: white;font-size: 20px;"
                 @click="isCollapse=!isCollapse">
              <i :class="isCollapse?'el-icon-arrow-left':'el-icon-arrow-right'"></i>
            </div>
          </el-col>
          <el-col :span="12" style="display: flex;flex-direction: row-reverse;">
            <div style="height: 50px;width: 100px;display: flex;align-items: center;">
              <el-image src="http://172.16.200.168/group1/M00/00/00/rBDIqF0cBbaABIg-AAFH8mTeDP421.jpeg"
                        style="width: 30px;height: 30px;border-radius: 15px;"></el-image>
              <span style="margin-left: 5px;color: white">测试用户</span>
            </div>
            <div>
              <el-badge :value="2" class="item" type="success">
                <div style="width: 1px;height: 1px;"></div>
              </el-badge>
              <el-badge :value="2" class="item" type="warning">
                <div style="width: 1px;height: 1px;"></div>
              </el-badge>
              <el-badge :value="2" class="item">
                <div style="width: 1px;height: 1px;"></div>
              </el-badge>
            </div>
          </el-col>
        </el-row>
        <div style="overflow-y: auto;">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        isCollapse: false,

      }
    },
    methods: {
      handleSelect(key, keyPath) {
        if (key != null) {
          this.$router.push({name: key});
        }
      }
    }
  }
</script>

<style>

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    color: white;
    flex-grow: 1;
  }

  .s-img-class {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }

  .u-img-class {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }

  .item {
    margin-top: 5px;
    margin-right: 30px;
  }

</style>
