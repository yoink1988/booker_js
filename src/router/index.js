import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/Empty'
import Auth from '@/components/Auth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Empty',
      component: Empty
    },
    {
      path: '/Auth',
      name: 'Auth',
      component: Auth
    }
  ]
})
