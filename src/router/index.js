import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyBrand from '@/components/MyBrand'
import Brand from '@/components/Brand'
import Specification from "@/components/Specification";
import TypeTemplate from "@/components/TypeTemplate";
import ItemCat from "@/components/ItemCat";
import GoodsEdit from "@/components/GoodsEdit";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
  ]
})
