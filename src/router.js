import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next()
        } else {
          next('/controlPanel')
        }
      },
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      beforeEnter: (to, from, next) => {
        if (!store.getters.isAuthenticated) {
          next()
        } else {
          next('/controlPanel')
        }
      },
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue')
    },
    {
      path: '/ControlPanel',
      name: 'ControlPanel',
      beforeEnter: (to, from, next) => {
        if (store.getters.isAuthenticated) {
          next()
        } else {
          next('/login')
        }
      },
      component: () => import(/* webpackChunkName: "controlPanel" */ './views/ControlPanel.vue')
    }
  ]
})
