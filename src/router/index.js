import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
// import Auth from '@/components/Auth'
import Employees from '@/components/Employees'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // props: ['user']      
    },
    // {
    //   path: '/',
    //   name: 'Auth',
    //   component: Auth
    // },
    {
      path: '/employees',
      name: 'Employees',
      component: Employees
    },
  ]
})
