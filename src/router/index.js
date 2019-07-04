import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyBrand from '@/components/MyBrand'
import Brand from '@/components/Brand'
import Specification from "@/components/Specification";
import TypeTemplate from "@/components/TypeTemplate";
import ItemCat from "@/components/ItemCat";
import GoodsEdit from "@/components/GoodsEdit";
import Goods from "@/components/Goods";
import FirstView from "@/components/FirstView";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'FirstView',
      component: FirstView
    },
    {
      path: '/mybrand',
      name: 'MyBrand',
      component: MyBrand
    },
    {
      path: '/brand',
      name: 'Brand',
      component: Brand
    },
    {
      path: '/specification',
      name: 'Specification',
      component: Specification
    },
    {
      path: '/typetemplate',
      name: 'TypeTemplate',
      component: TypeTemplate
    },
    {
      path: '/itemcat',
      name: 'ItemCat',
      component: ItemCat
    },
    {
      path: '/goodsedit',
      name: 'GoodsEdit',
      component: GoodsEdit
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
  ]
})
