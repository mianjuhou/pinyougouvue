import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyBrand from '@/components/MyBrand'
import Brand from '@/components/Brand'
import Specification from "@/components/Specification";

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
  ]
})
