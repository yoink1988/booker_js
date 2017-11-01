import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Auth from '@/components/Auth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // props: ['user']      
    },
    {
      path: '/',
      name: 'Auth',
      component: Auth
    }
  ]
})
