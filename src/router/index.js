import Vue from 'vue'
import Router from 'vue-router'
import Empty from '@/components/Empty'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Empty',
      component: Empty
    }
  ]
})
