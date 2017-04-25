import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import app from './app'
import goods from './components/goods/goods'
import seller from './components/seller/seller'
import ratings from './components/ratings/ratings'

import './common/font.styl'
import './mock/mockAPI'
// 声明使用VueRouter
Vue.use(VueRouter)
Vue.use(VueResource)
// 创建路由器对象来管理路由
const router = new VueRouter({
  linkActiveClass: 'active',
  history: true
})
// 映射路由
router.map({
  '/goods': {
    component: goods
  },
  '/seller': {
    component: seller
  },
  '/ratings': {
    component: ratings
  }
})
// 开启路由
router.start(app, '#app')
// 默认路由
router.go('/goods')
