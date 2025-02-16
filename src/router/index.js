import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('../views/Index'),
    children: [{
      path: '',
      name: 'home',
      component: () => import('../views/index/Home')
    }, {
      path: '/index/detail/:id',
      name: 'detail',
      component: () => import('../views/index/Detail')
    }, {
      path: 'renttype',
      name: 'renttype',
      component: () => import('../views/index/Renttype')
    }, {
      path: 'news',
      name: 'news',
      component: () => import('../views/index/News')
    }, {
      path: 'agreement',
      name: 'agreement',
      component: () => import('../views/index/Agreement')
    }, {
      path: 'pay',
      name: 'pay',
      component: () => import('../views/index/Pay')
    }, {
      path: 'feedback',
      name: 'feedback',
      component: () => import('../views/index/Feedback')
    }, {
      path: 'admin',
      name: 'admin',
      component: () => import('../views/Admin'),
      children: [{
        path: '',
        redirect: 'info'
      }, {
        path: 'info',
        name: 'info',
        component: () => import('../views/admin/AdminInfo')
      }, {
        path: 'house',
        name: 'house',
        component: () => import('../views/admin/AdminHouse')
      }, {
        path: 'order',
        name: 'order',
        component: () => import('../views/admin/AdminOrder')
      }, {
        path: 'user',
        name: 'user',
        component: () => import('../views/admin/AdminUser')
      }, {
        path: 'feedback',
        name: 'feedback',
        component: () => import('../views/admin/AdminFeedback')
      }, {
        path: 'news',
        name: 'news',
        component: () => import('../views/admin/AdminNews')
      }, {
        path: 'home',
        name: 'home',
        component: () => import('../views/admin/AdminHome')
      }, {
        path: 'collect',
        name: 'collect',
        component: () => import('../views/admin/AdminCollect')
      }, {
        path: 'release',
        name: 'release',
        component: () => import('../views/admin/AdminRelease')
      }, {
        path: 'password',
        name: 'password',
        component: () => import('../views/admin/AdminPassword')
      }, {
        path: 'myfeedback',
        name: 'myfeedback',
        component: () => import('../views/admin/AdminMyfeedback')
      }]
    }]
  },
  {
    path: '*',
    name: '/404',
    component: ()=>import('../views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // 跳转后滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.mytoken ? true : false
  if (to.path == '/index/admin/info' || to.path == '/index/admin/house' || to.path == '/index/admin/order' || to.path == '/index/admin/user' || to.path == '/index/admin/feedback' || to.path == '/index/admin/news' || to.path == '/index/admin/home' || to.path == '/index/admin/collect' || to.path == '/index/admin/release' || to.path == '/index/admin/password' || to.path == '/index/admin/myfeedback') {
    if (isLogin) {
      next()
    } else {
      next('/index')
    }
  } else {
    next()
  }
})

export default router
